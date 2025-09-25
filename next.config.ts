const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/chat',
        // Replace with your EC2 instance's public IP and port
        // Note: This proxies a secure request to an insecure endpoint. 
        // This should only be used for development/testing, NOT production.
        destination: 'http://15.207.108.190:8000/chat',
      },
    ];
  },
};

export default nextConfig;
