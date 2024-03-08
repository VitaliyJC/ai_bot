# Base on offical Node.js Alpine image
FROM node:20-alpine 

# Set working directory
WORKDIR /usr/app

# Install pnpm globally
RUN npm install -g pnpm

# Install PM2 globally
RUN pnpm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN pnpm install --production

# Copy all files
COPY ./ ./

USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "pnpm", "--restart-delay=10000", "--", "start" ]
# CMD [ "pm2","start", "yarn", "--restart-delay=10000", "--", "start" ]
# pm2 start npm --watch --ignore-watch="node_modules" --restart-delay=10000 --name "app_name1" -- start