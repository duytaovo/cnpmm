import { Request, Response } from 'express'
import { UserModel } from '../../database/models/user.model'
import { hashValue } from '../../utils/crypt'
import { responseSuccess, ErrorHandler } from '../../utils/response'
import { STATUS } from '../../constants/status'
import { uploadFile } from '../../utils/upload'
import { FOLDERS } from '../../constants/config'

const addUser = async (req: Request, res: Response) => {
    const {
        email,
        password,
        address,
        date_of_birth,
        name,
        phone,
        roles,
        avatar
    } = req.body

    const user = await UserModel.findOne({ email: email });
    if (!user) {
        const hashedPassword = hashValue(password);
        const newUser = new UserModel({
            email: email,
            password: hashedPassword,
            address: address,
            date_of_birth: date_of_birth,
            name: name,
            phone: phone,
            roles: roles,
            avatar: avatar
        });

        const savedUser = await newUser.save();
        const response = {
            message: 'Thêm người dùng thành công',
            data: savedUser,
        };
        return responseSuccess(res, response);
    } else {
        throw new ErrorHandler(422, { email: 'Email đã tồn tại' })
    }
}

const getUsers = async (req: Request, res: Response) => {
    const usersDB = await UserModel.find({})
        .select({ password: 0, __v: 0 })
        .lean();

    const response = {
        message: 'Lấy danh sách người dùng thành công',
        data: usersDB,
    }
    return responseSuccess(res, response);
}

const getUser = async (req: Request, res: Response) => {
    const userDB = await UserModel.findById(req.params.user_id)
        .select({ password: 0, __v: 0 })
        .lean();
    if (userDB) {
        const response = {
            message: 'Lấy người dùng thành công',
            data: userDB,
        }
        return responseSuccess(res, response)
    } else {
        throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng');
    }
}

const updateUser = async (req: Request, res: Response) => {
    const {
        email,
        address,
        date_of_birth,
        name,
        phone,
        roles,
        avatar
    } = req.body;
    const newUserData = {
        email,
        address,
        date_of_birth,
        name,
        phone,
        roles,
        avatar
    }
    // Tìm và cập nhật người dùng dựa trên ID
    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.params.user_id }, // Điều kiện tìm kiếm
        { $set: newUserData }, // Dữ liệu mới cần cập nhật
        { new: true } // Trả về bản ghi mới sau khi cập nhật
    );
    if (updateUser) {
        const response = {
            message: 'Cập nhật người dùng thành công',
            data: updatedUser,
        }
        return responseSuccess(res, response);
    } else {
        throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng');
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    const userDB = await UserModel.findByIdAndDelete(user_id).lean()
    if (userDB) {
        return responseSuccess(res, { message: 'Xóa thành công' })
    } else {
        throw new ErrorHandler(STATUS.BAD_REQUEST, 'Không tìm thấy người dùng')
    }
}

const uploadAvatar = async (req: Request, res: Response) => {
    const path = await uploadFile(req, FOLDERS.AVATAR)
    const response = {
        message: 'Upload ảnh đại diện thành công',
        data: path,
    }
    return responseSuccess(res, response)
}

const userController = {
    addUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadAvatar,
}

export default userController