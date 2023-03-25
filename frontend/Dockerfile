FROM node

WORKDIR /frontend

COPY package.json .
RUN npm install --quiet

COPY . .

EXPOSE 3000
