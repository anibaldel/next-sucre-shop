import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import Order from '../../../models/Order';
import { IOrder } from '../../../interfaces/order';
import { isValidObjectId } from 'mongoose';

type Data = 
| { message: string }
| IOrder[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getOrders(req, res);
        case 'PUT':
            return updateOrder(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
    
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>)=> {
    
    await db.connect();
    const orders = await Order.find()
        .sort({ createdAt: 'desc'})
        .populate('user', 'name email')
        .lean();
    await db.disconnect();

    return res.status(201).json(orders)
}

const updateOrder = async(req: NextApiRequest, res: NextApiResponse<Data>)=> {
    
    const { orderId='', updatePaid = ''} = req.body;
    if(!isValidObjectId(orderId)) {
        return res.status(400).json({ message: 'No existe la orden con ese id' })
    }

    await db.connect();
    const order = await Order.findById( orderId );
    if( !order ) {
        await db.disconnect();
        return res.status(400).json({ message: 'Orden no encontrada ' + orderId })
    }
    if( updatePaid === 'paid') {
        order.isPaid = true;
    } else {
        order.isPaid = false;
    }
    await order.save();
    await db.disconnect();
    return res.status(200).json( {message: 'Orden actualizada'} );
}
