const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    // [GET] /auth/login
    login(req, res) {
        if (req.user) return res.redirect('/');
        res.render('auth/login');
    }

    // [POST] /auth/login
    async loginPost(req, res, next) {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.render('auth/login', { error: 'Tên đăng nhập không tồn tại!' });
            }

            if (user.isBlocked) {
                return res.render('auth/login', { error: 'Tài khoản của bạn đã bị khóa! Vui lòng liên hệ quản trị viên.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.render('auth/login', { error: 'Mật khẩu không đúng!' });
            }

            const token = jwt.sign({ _id: user._id, username: user.username, fullname: user.fullname, avatar: user.avatar, role: user.role }, 'MY_SECRET_KEY', { expiresIn: '1d' });
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');

        } catch (err) {
            next(err);
        }
    }

    // [GET] /auth/register
    register(req, res) {
        if (req.user) return res.redirect('/');
        res.render('auth/register');
    }

    // [POST] /auth/register
    async registerPost(req, res, next) {
        const { username, email, password, fullname } = req.body;
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.render('auth/register', { error: 'Tên đăng nhập đã tồn tại!' });
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.render('auth/register', { error: 'Email đã được đăng ký!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                fullname,
                password: hashedPassword
            });

            await user.save();
            res.redirect('/auth/login');

        } catch (err) {
            next(err);
        }
    }

    // [GET] /auth/logout
    logout(req, res) {
        res.clearCookie('token');
        res.redirect('/');
    }
}

module.exports = new AuthController();
