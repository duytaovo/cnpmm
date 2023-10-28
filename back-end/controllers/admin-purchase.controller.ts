import { Request, Response } from 'express'
import { STATUS_PURCHASE } from '../constants/purchase'
import { STATUS } from '../constants/status'
import { ProductModel } from '../database/models/product.model'
import { PurchaseModel } from '../database/models/purchase.model'
import { ErrorHandler, responseSuccess } from '../utils/response'
import { handleImageProduct } from './product.controller'
import { cloneDeep } from 'lodash'

export const updatePurchase = async (req: Request, res: Response) => {
  const { _id } = req.params
  const purchaseInDb: any = await PurchaseModel.findOne({
    status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
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

export const getPurchaseDetail = async (req: Request, res: Response) => {
  const { _id } = req.params
  const purchaseInDb: any = await PurchaseModel.findOne({
    status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
    _id,
  })
    .populate({
      path: 'product',
      populate: {
        path: 'category',
      },
    })
    .lean()
  if (purchaseInDb) {
    const response = {
      message: 'Lấy đơn thành công',
      purchaseInDb,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn')
  }
}

export const buyProducts = async (req: Request, res: Response) => {
  const purchases = []
  for (const item of req.body) {
    const product: any = await ProductModel.findById(item.product_id).lean()
    if (product) {
      if (item.buy_count > product.quantity) {
        throw new ErrorHandler(
          STATUS.NOT_ACCEPTABLE,
          'Số lượng mua vượt quá số lượng sản phẩm'
        )
      } else {
        let data = await PurchaseModel.findOneAndUpdate(
          {
            user: req.jwtDecoded.id,
            status: STATUS_PURCHASE.IN_CART,
            product: {
              _id: item.product_id,
            },
          },
          {
            buy_count: item.buy_count,
            status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
          },
          {
            new: true,
          }
        )
          .populate({
            path: 'product',
            populate: {
              path: 'category',
            },
          })
          .lean()
        if (!data) {
          const purchase = {
            user: req.jwtDecoded.id,
            product: item.product_id,
            buy_count: item.buy_count,
            price: product.price,
            price_before_discount: product.price_before_discount,
            status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
          }
          const addedPurchase = await new PurchaseModel(purchase).save()
          data = await PurchaseModel.findById(addedPurchase._id).populate({
            path: 'product',
            populate: {
              path: 'category',
            },
          })
        }
        purchases.push(data)
      }
    } else {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm')
    }
  }
  const response = {
    message: 'Mua thành công',
    data: purchases,
  }
  return responseSuccess(res, response)
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
    // purchase.product = handleImageProduct(cloneDeep(purchase.product))
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
  updatePurchase,
  getPurchases,
  getPurchaseDetail,
}

export default adminPurchaseController
