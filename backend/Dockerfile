
FROM node:18

COPY . .

# Install dependencies
RUN npm install --force

# Expose the port your app runs on
EXPOSE 7700

# Command to run your app using nodemon
CMD ["node", "app.js"]
