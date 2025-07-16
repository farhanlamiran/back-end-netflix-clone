const { ERR, OK } = require("../utils/response")
const { User } = require("../models/index.model")
const argon2 = require("argon2")

const GetFavoriteMovies = async (req, res) => {
    return OK(res, 200, req.user, "Get Favorite Movies Success")
}

const AddFavoriteMovies = async (req, res) => {
    try {
        // tangkap data film dari client, otomatis ketika menulis json, butuh memasukan key data
        const { data } = req.body
        // ambil model dari mongoose dan copy ke memory internal
        const user = await User.findById(req.user._id)
        // menentukan key apa yang mau diupdate pada model
        user.favoriteMovies.push(data)
        // actionnya untuk update atau insert data ke mongodb
        await user.save()
        return OK(res, 201, user.favoriteMovies, "Add Favorite Movies Success")
    } catch (error) {
        return ERR(res, 500, "error Add Favorite Movies")
    }
}

const RemoveFavoriteMovies = async (req, res) => {
    try {
        // kenapa tidak ada email dan token masuk kesini? karena sudah di validasi oleh middleware checktoken
        const { movieID } = req.body
        const user = await User.findById(req.user._id)

        // hasil pengembaliannya ada true or false, bahwa id tersebut ada atau tidak di database
        const existingMovie = user.favoriteMovies.some(movie => movie.id === movieID)

        if (!existingMovie) return ERR(res, 404, "Movie ID not found")

        //  nilai pengembaliannya adalah list of dict, selain dari id = 2, artinya rest of it akan di kembalikan
        user.favoriteMovies = user.favoriteMovies.filter(movie => movie.id !== movieID)

        await user.save()

        return OK(res, 204, null, "Removing Favorite Movies Success")
    } catch (error) {
        return ERR(res, 500, "error Removing Favorite Movies")
    }
}

const checkFavotireMovies = async(req, res)=>{
    try {
        const { movieID } = req.body
    
        const user = await User.findById(req.user._id)
    
        const isFavorited = user.favoriteMovies.some(movie => movie.id === movieID)
        return OK(res, 200, {isFavorited}, "check favorite movie by id success")
    } catch (error) {
        return ERR(res, 500, "error checking Favorite Movies")
    }
}

const SignInToken = async (req, res) => {
    try {
        const { email, password, token } = req.body;

        // const atau konstanta tidak bisa diubah atau ditimpah, tapi kalo let bisa ditimpa dengan object baru
        let user = await User.findOne({ email })
        // jika email ada di db maka update token dari firebase saja, jika tidak ada maka create new user email and token
        // kegunaan di validasi adalah agar bisa sign in sign up
        if (!user) return ERR(res, 400, "User Not Found")

        const isPasswordOK = await argon2.verify(user.password, password)

        if (!isPasswordOK) return ERR(res, 400, "Password Wrong")

        user.token = token

        await user.save()

        return OK(res, 200, null, "Sign-in token saved")
    } catch (err) {
        return ERR(res, 500, "error sign in token")
    }
}

const SignOutToken = async (req, res) => {
    const user = await User.findById(req.user._id)
    user.token = null

    await user.save()
    return OK(res, 204, null, "Sign-Out Success")
}

const SignUpUser = async (req, res) => {
    const { email, password } = req.body
    const hashPass = await argon2.hash(password)
    try {
        const user = await User.findOne({ email })

        if (user) return ERR(res, 400, "email not available")

        const addNewUser = new User({ email, password: hashPass })
        await addNewUser.save()
        return OK(res, 201, addNewUser._id, "Sign-up success")
    } catch (error) {
        console.log(error)
        return ERR(res, 500, "Signup Failed")
    }
}

module.exports = { SignInToken, GetFavoriteMovies, AddFavoriteMovies, RemoveFavoriteMovies, SignOutToken, SignUpUser, checkFavotireMovies }