const API_BASE_URL = "http://localhost:8082";

// Helper to handle API responses
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "API request failed");
    }

    // Handle empty responses (e.g. from DELETE or void methods)
    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch (e) {
        // Response is likely plain text
        return text;
    }
}

// -------------------- Jobs --------------------
export async function getJobs() {
    return request("/job/search?keyword="); // Using search to get all or implement getAll in backend
}

export async function getJobsByClient(clientId) {
    if (!clientId) return [];
    return request(`/job/client/${clientId}`);
}

export async function getJobsByFreelancer(freelancerId) {
    if (!freelancerId) return [];
    return request(`/job/freelancer/${freelancerId}`);
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
    const user = getCurrentUser();
    if (!user || !user.id) {
        throw new Error("You must be logged in to update a job.");
    }

    // Include clientId for ownership validation
    const payload = {
        ...jobData,
        clientId: user.id
    };

    return request(`/job/update/${jobId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteJob(jobId) {
    const user = getCurrentUser();
    if (!user || !user.id) {
        throw new Error("You must be logged in to delete a job.");
    }

    return request(`/job/delete/${jobId}?userId=${user.id}`, {
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
export async function login(userName, password) {
    const response = await request(`/auth/login`, {
        method: "POST",
        body: JSON.stringify({ userName, password })
    });

    if (response && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        return response.user;
    }

    throw new Error("Invalid credentials");
}

export async function register(userData) {
    const response = await request(`/auth/register`, {
        method: "POST",
        body: JSON.stringify(userData)
    });
    return response; // "User registered successfully"
}

export async function forgotPassword(email) {
    const text = await request(`/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: "POST"
    });
    return text; // Returns the token for now (mock)
}

export async function resetPassword(token, newPassword) {
    return request(`/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: "POST"
    });
}

export async function resetPasswordDirectly(email, newPassword) {
    return request(`/auth/reset-password-direct?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: "POST"
    });
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
            const exp = parseInt(queryOrFilters.experience);
            if (!isNaN(exp)) params.append("minExperience", exp);
        }
    }
    const url = `/freelancer/search?${params.toString()}`;
    console.log("Searching freelancers with URL:", url);
    return request(url);
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
    const url = `/job/search?${params.toString()}`;
    console.log("Searching jobs with URL:", url);
    const data = await request(url);
    console.log("Search results received:", data);
    return data;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
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

// -------------------- Reviews --------------------
export async function submitReview(reviewData) {
    return request("/reviews/submit", {
        method: "POST",
        body: JSON.stringify(reviewData)
    });
}

export async function getReviewsForUser(userId) {
    return request(`/reviews/reviewee/${userId}`);
}

export async function getAverageRating(userId) {
    return request(`/reviews/rating/${userId}`);
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
// -------------------- Chats --------------------
export async function createChat(jobId, freelancerId, clientId) {
    return request(`/chats/create?jobId=${jobId}&freelancerId=${freelancerId}&clientId=${clientId}`, {
        method: "POST"
    });
}
