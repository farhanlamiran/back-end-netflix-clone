const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../index')

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URL)
    await request(app).post("/my-movies").send({
        email: "lamiran@gmail.com",
        token: "123123123",
        data: {
            id: 2,
            title: "testing",
            desc: "testing testing"
        }
    });
})

afterEach(async () => {
    await mongoose.connection.close()
})

describe('Resource /my-movies', () => {

    it('should return a success message', async () => {
        const response = await request(app).get(
            "/my-movies/lamiran@gmail.com/123123123"
        );
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe("Get Favorite Movies Success")
    });

    it('should return unauthorized message', async () => {
        const response = await request(app).get(
            "/my-movies/lamiran@gmail.com/1231231231"
        );
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Error, Unauthorized")
    });

    it('should return success adding favorite movies', async () => {
        const response = await request(app)
            .post("/my-movies")
            .set("Content-Type", "application/json")
            .send({
                email: "lamiran@gmail.com",
                token: "123123123",
                data: {
                    id: 2,
                    title: "testing",
                    desc: "testing testing"
                }
            })
        expect(response.statusCode).toBe(201)
        expect(response.body.message).toBe("Add Favorite Movies Success")
    });

    it('should return failed to save favorite movies', async () => {
        const response = await request(app)
            .post("/my-movies")
            .set("Content-Type", "application/json")
            .send({
                email: "lamiran@gmail.com",
                token: "1231231231",
                data: {
                    id: 2,
                    title: "testing",
                    desc: "testing testing"
                }
            })
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Error, Unauthorized")
    });

    it('should delete a favorite movie successfully', async () => {
        const response = await request(app)
            .delete("/my-movies")
            .set("Content-Type", "application/json")
            .send({
                email: "lamiran@gmail.com",
                token: "123123123",
                movieID: 2
            })
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Removing Favorite Movies Success");
    });

    it('should failed to delete a favorite movie', async () => {
        const response = await request(app)
            .delete("/my-movies")
            .set("Content-Type", "application/json")
            .send({
                email: "lamiran@gmail.com",
                token: "1231231231",
                movieID: 2
            })
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Error, Unauthorized")
    });

    it('should failed to delete a favorite movie because id not found', async () => {
        const response = await request(app)
            .delete("/my-movies")
            .set("Content-Type", "application/json")
            .send({
                email: "lamiran@gmail.com",
                token: "123123123",
                movieID: 4
            })
        expect(response.statusCode).toBe(404)
        expect(response.body.message).toBe("Movie ID not found")
    });

});

describe('Resource /my-token', () => {

    it('should return success sign in', async () => {
        const response = await request(app)
            .post("/my-token")
            .set("Content-Type", "application/json")
            .send({
                // email salah
                email: "faang@gmail.com",
                password: "123456",
                token: "123123123"
            })
        console.log(response.statusCode)
        console.log(response.body.message)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("User Not Found")
    });

    it('should return failed user not found', async () => {
        const response = await request(app)
            .post("/my-token")
            .set("Content-Type", "application/json")
            .send({
                // email salah
                email: "faang@gmail.com",
                password: "123456",
                token: "123123123"
            })
        console.log(response.statusCode)
        console.log(response.body.message)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe("User Not Found")
    });
})
