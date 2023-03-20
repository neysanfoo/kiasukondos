FROM node

WORKDIR /chatsocket

COPY package.json .
RUN npm install --quiet

COPY . .

EXPOSE 3000