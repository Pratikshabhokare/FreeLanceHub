const BASE_URL = "http://localhost:8080";

// Helper to handle API responses
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "API request failed");
    }

    // Handle empty responses (e.g. from DELETE or void methods)
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// -------------------- Jobs --------------------
export async function getJobs() {
    return request("/job/search?keyword="); // Using search to get all or implement getAll in backend
}

export async function getJobsByClient(clientId) {
    if (!clientId) return [];
    return request(`/job/client/${clientId}`);
}

export async function getPublicJobs() {
    // We can filter on frontend or add backend endpoint. For now fetching all.
    return request("/job/status/OPEN");
}

export async function createJob(jobData) {
    const user = getCurrentUser();
    if (!user || !user.id) {
        throw new Error("You must be logged in to create a job.");
    }

    // Match DTO structure expected by backend
    const payload = {
        ...jobData,
        client: { id: user.id },
        status: "OPEN"
    };

    return request("/job/save", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateJob(jobId, jobData) {
    return request(`/job/update/${jobId}`, {
        method: "PUT",
        body: JSON.stringify(jobData),
    });
}

export async function deleteJob(jobId) {
    return request(`/job/delete/${jobId}`, {
        method: "DELETE",
    });
}

// -------------------- Proposals --------------------
// -------------------- Proposals --------------------
export async function getFreelancerProposals(freelancerId) {
    if (!freelancerId) {
        // Fallback to current user if not provided
        const user = getCurrentUser();
        freelancerId = user?.id;
    }
    if (!freelancerId) return []; // Return empty if no user logged in
    return request(`/proposals/freelancer/${freelancerId}`);
}

export async function getProposalsByJob(jobId) {
    return request(`/proposals/job/${jobId}`);
}

export async function submitProposal(freelancerId, proposalData) {
    return request(`/proposals/freelancer/${freelancerId}`, {
        method: "POST",
        body: JSON.stringify(proposalData),
    });
}

export async function updateProposalStatus(proposalId, status) {
    return request(`/proposals/${proposalId}/status?status=${status}`, {
        method: "PUT"
    });
}

export async function withdrawProposal(proposalId) {
    return updateProposalStatus(proposalId, "WITHDRAWN");
}

// -------------------- Users --------------------
export async function login(email, password) {
    // Call the real backend login endpoint
    const user = await request(`/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: "POST"
    });

    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        return user;
    }

    throw new Error("Invalid credentials");
}

export async function register(userData) {
    // Backend: POST /users/saveUser
    // Expects UserDto body
    const response = await request(`/users/saveUser`, {
        method: "POST",
        body: JSON.stringify(userData)
    });
    // Controller returns boolean true/false
    if (response === true) {
        return true;
    }
    throw new Error("Registration failed");
}

export async function updateUser(userId, userData) {
    return request(`/users/update/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
    });
}

// -------------------- Freelancer Profile --------------------
export async function getFreelancerProfile(freelancerId) {
    return request(`/freelancer/${freelancerId}/profile`);
}

export async function saveFreelancerProfile(freelancerId, profileData) {
    return request(`/freelancer/${freelancerId}/profile`, {
        method: "POST", // Controller uses POST for saveOrUpdate
        body: JSON.stringify(profileData),
    });
}

// Search Freelancers
export async function searchFreelancers(queryOrFilters) {
    let params = new URLSearchParams();
    if (typeof queryOrFilters === 'string') {
        params.append("skills", queryOrFilters);
    } else if (typeof queryOrFilters === 'object') {
        if (queryOrFilters.searchQuery) params.append("skills", queryOrFilters.searchQuery);
        if (queryOrFilters.maxPrice) params.append("maxHourlyRate", queryOrFilters.maxPrice);
        if (queryOrFilters.experience) {
            // Extract number
            const exp = parseInt(queryOrFilters.experience);
            if (!isNaN(exp)) params.append("minExperience", exp);
        }
    }
    return request(`/freelancer/search?${params.toString()}`);
}

// Search Jobs
export async function searchJobs(queryOrFilters) {
    let params = new URLSearchParams();
    if (typeof queryOrFilters === 'string') {
        params.append("keyword", queryOrFilters);
    } else if (typeof queryOrFilters === 'object') {
        if (queryOrFilters.searchQuery) params.append("keyword", queryOrFilters.searchQuery);
        if (queryOrFilters.title) params.append("title", queryOrFilters.title);
        if (queryOrFilters.minPrice) params.append("minBudget", queryOrFilters.minPrice);
        if (queryOrFilters.maxPrice) params.append("maxBudget", queryOrFilters.maxPrice);
        // duration, skills...
    }
    return request(`/job/search?${params.toString()}`);
}

export function logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
}

export function getCurrentUser() {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
}

// -------------------- Messaging --------------------
export async function createOrGetChat(jobId, freelancerId, clientId) {
    return request(`/chats/create?jobId=${jobId}&freelancerId=${freelancerId}&clientId=${clientId}`, {
        method: "POST"
    });
}

export async function getUserChats(userId) {
    return request(`/chats/user/${userId}`);
}

export async function getChatMessages(chatId) {
    return request(`/chats/${chatId}/messages`);
}

export async function sendMessage(chatId, senderId, content) {
    return request(`/chats/${chatId}/send?senderId=${senderId}`, {
        method: "POST",
        body: content // Sending raw string as body based on Controller @RequestBody String
    });
}

// -------------------- Notifications --------------------
export async function getUnreadNotifications(userId) {
    return request(`/notifications/${userId}/unread`);
}

export async function markNotificationAsRead(id) {
    return request(`/notifications/${id}/read`, { method: "PUT" });
}

export async function markAllNotificationsAsRead(userId) {
    return request(`/notifications/user/${userId}/read-all`, { method: "PUT" });
}

// -------------------- Payments --------------------
export async function submitPayment(jobId, payerId) {
    return request(`/payments/pay/${jobId}?payerId=${payerId}`, {
        method: "POST"
    });
}

export async function getPaymentHistory(userId) {
    return request(`/payments/history/${userId}`);
}
