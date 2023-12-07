import { Request, Response } from 'express'
import { STATUS_PURCHASE } from '../../constants/purchase'
import { STATUS } from '../../constants/status'
import { ProductModel } from '../../database/models/product.model'
import { PurchaseModel } from '../../database/models/purchase.model'
import { ErrorHandler, responseSuccess } from '../../utils/response'
import { cloneDeep } from 'lodash'
import {
    handleImageProduct,
    handleImageProductDetail,
} from './product.controller'

export const updateGetting = async (req: Request, res: Response) => {
    const { _id } = req.params
    const purchaseInDb: any = await PurchaseModel.findOne({
        status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
        _id: _id,
    })
    if (purchaseInDb) {
        const data = await PurchaseModel.findByIdAndUpdate(
            _id,
            { status: STATUS_PURCHASE.WAIT_FOR_GETTING },
            { new: true }
        )

        const response = {
            message: 'Cập nhật đơn thành công',
            data,
        }
        return responseSuccess(res, response)
    } else {
        throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn')
    }
}

export const updateProgress = async (req: Request, res: Response) => {
    const { _id } = req.params
    const purchaseInDb: any = await PurchaseModel.findOne({
        status: STATUS_PURCHASE.WAIT_FOR_GETTING,
        _id: _id,
    })
    if (purchaseInDb) {
        const data = await PurchaseModel.findByIdAndUpdate(
            _id,
            { status: STATUS_PURCHASE.IN_PROGRESS },
            { new: true }
        )

        const response = {
            message: 'Cập nhật đơn thành công',
            data,
        }
        return responseSuccess(res, response)
    } else {
        throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn')
    }
}

export const updateDelivered = async (req: Request, res: Response) => {
    const { _id } = req.params
    const purchaseInDb: any = await PurchaseModel.findOne({
        status: STATUS_PURCHASE.IN_PROGRESS,
        _id: _id,
    })
    if (purchaseInDb) {
        const data = await PurchaseModel.findByIdAndUpdate(
            _id,
            { status: STATUS_PURCHASE.DELIVERED },
            { new: true }
        )

        const response = {
            message: 'Cập nhật đơn thành công',
            data,
        }
        return responseSuccess(res, response)
    } else {
        throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn')
    }
}

export const updateCancel = async (req: Request, res: Response) => {
    const { _id } = req.params
    const purchaseInDb: any = await PurchaseModel.findOne({
        status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
        _id: _id,
    })
    if (purchaseInDb) {
        const data = await PurchaseModel.findByIdAndUpdate(
            _id,
            { status: STATUS_PURCHASE.CANCELLED },
            { new: true }
        )

        const response = {
            message: 'Cập nhật đơn thành công',
            data,
        }
        return responseSuccess(res, response)
    } else {
        throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn')
    }
}

export const getPurchaseDetail = async (req: Request, res: Response) => {
    const { _id } = req.params
    let purchaseInDb: any = await PurchaseModel.findOne({
        // status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
        _id,
    })
        .populate({
            path: 'product',
            populate: {
                path: 'category',
            },
        })
        .lean()
    let images = purchaseInDb?.product?.images?.map((item) => {
        item = handleImageProductDetail(cloneDeep(item))
        return item
    })

    if (purchaseInDb) {
        const response = {
            message: 'Lấy đơn thành công',
            purchaseInDb,
            images,
        }
        return responseSuccess(res, response)
    } else {
        throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn')
    }
}

export const getPurchases = async (req: Request, res: Response) => {
    const { status = STATUS_PURCHASE.ALL } = req.query
    let condition: any = {
        status: {
            $ne: STATUS_PURCHASE.ALL,
        },
    }
    if (Number(status) !== STATUS_PURCHASE.ALL) {
        condition.status = status
    }

    let purchases: any = await PurchaseModel.find(condition)
        .populate({
            path: 'product',
            populate: {
                path: 'category',
            },
        })
        .sort({
            createdAt: -1,
        })
        .lean()
    purchases = purchases.map((purchase) => {
        purchase.product = handleImageProduct(cloneDeep(purchase.product))
        return purchase
    })
    const response = {
        message: 'Lấy đơn mua thành công',
        data: purchases,
    }
    return responseSuccess(res, response)
}

export const deletePurchases = async (req: Request, res: Response) => {
    const purchase_ids = req.params
    const deletedData = await PurchaseModel.deleteMany({
        // status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
        _id: { $in: purchase_ids },
    })
    return responseSuccess(res, {
        message: `Xoá ${deletedData.deletedCount} đơn thành công`,
        data: { deleted_count: deletedData.deletedCount },
    })
}

const adminPurchaseController = {
    deletePurchases,
    getPurchases,
    getPurchaseDetail,
    updateGetting,
    updateProgress,
    updateDelivered,
    updateCancel,
}

export default adminPurchaseController
