FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=4444
ENV PGUSER="neondb_owner"
ENV PGPASSWORD="npg_yp3ETO7asnfw"
ENV PGHOST="ep-raspy-wildflower-aonookgd-pooler.c-2.ap-southeast-1.aws.neon.tech"
ENV PGDATABASE="neondb"
ENV ARCJET_KEY="ajkey_01kw9z0y16ejhrb9hw97f6rnx4"
ENV ARCJET_ENV=development

EXPOSE 4444

CMD ["npm", "run", "dev"]
