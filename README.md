# Express RESTful API

An attendance application RESTful API was built using Express and TypeScript.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Screenshoot](#screenshot)
---

## Requirements

Before setting up the project, make sure your system meets the following requirements:

- **Node**: 20
- **Express**: 4
- **MySQL**:  ^5.7
- **Redis**: 7.4
- **ElasticSearch**: 8.5

---

## Installation

Follow the steps below to set up the project on your local machine.

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Devajayantha/express-clock.git
    ```

2. **Navigate into the project directory**:
    ```bash
    cd express-clock
    ```

3. **Install the required dependencies** using npm:
    ```bash
    npm install
    ```

4. **Copy the `.env.example` file to `.env`**:
    ```bash
    cp .env.example .env
    ```

5. **Set up the database**:
    - Configure your database connection in the `.env` file.
    - Run migrations to create the necessary tables:
      ```bash
      npx prisma migrate deploy
      ```

6. **Run the seeder if needed**:
      ```bash
      npx prisma db seed
      ```
7. **Run project on deplopment mode**:
      ```bash
      npm run start
      ```
## Screenshoot

Here’s some screenshoot from my work.

![Screenshot](https://devajayantha.github.io/assets/image-kp/image1.png)

![Screenshot](https://devajayantha.github.io/assets/image-kp/image3.png)

![Screenshot](https://devajayantha.github.io/assets/image-kp/image4.png)

![Screenshot](https://devajayantha.github.io/assets/image-kp/image5.png)

![Screenshot](https://devajayantha.github.io/assets/image-kp/image2.png)


### Thank You
