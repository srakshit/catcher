FROM node:8.10.0

WORKDIR /code

#Only required for debugging
RUN npm install -g nodemon yarn knex

COPY . /code

EXPOSE 8080

CMD ["npm", "start"]
