const apiService = async (method, url, body = null, header = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...header,
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error; // Re-throw the error for handling in the caller
  }
};

export default apiService;
