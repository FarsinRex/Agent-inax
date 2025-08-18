# Use Node image
FROM node:18

WORKDIR /app

# Copy dependencies first
COPY package*.json ./
RUN npm install

# Copy rest of the frontend
COPY . .

# Expose Next.js port
EXPOSE 3000

# Run development server (for prod, use 'next build' + 'next start')
CMD ["npm", "run", "dev"]
