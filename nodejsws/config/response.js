let response = {
    Response: (status, message, data) => {
        return {
            status: status || null,
            message: message || "",
            data: data || []
        }
    }
}

module.exports = response;