
FROM node:18



# Install dependencies
RUN npm install --force


COPY . .

# Expose the port your app runs on
EXPOSE 7700

# Command to run your app using nodemon
CMD ["node", "app.js"]


