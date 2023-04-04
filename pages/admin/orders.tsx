import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid, Select, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { IOrder, IUser } from '../../interfaces';
import { useState, useEffect } from 'react';
import tesloApi from '../../api/tesloApi';

const OrdersPage = () => {

  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if(data) {
      setOrders(data)
    }
  }, [data])

  if( !data && !error ) return (<></>);

  const onPaidUpdated=async( orderId: string, updatePaid: string)=> {
    const previosOrders = orders.map( order=> ({...order}))
    const updatedOrders = orders.map( order =>({
        ...order,
        isPaid: orderId === order._id && (updatePaid === 'paid' ? true : false)
    }));

    setOrders(updatedOrders);
    try {
        await tesloApi.put('/admin/orders', { orderId, updatePaid })
    } catch (error) {
        setOrders(previosOrders)
        alert(' No se pudo actualizar la orden')
    }

}

  const columns:GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 200 },
    { 
      field: 'changePaid', 
      headerName: 'Actualizar pago', 
      width: 250,
      renderCell: ({row}: GridValueGetterParams )=> {
          return (
              <Select
                  value={ row.changePaid }
                  label="Actualizar pago"
                  onChange={({target})=> onPaidUpdated( row.id, target.value) }
                  sx={{ width: '300px'}}
              >   
                  <MenuItem value='pending'> Pendiente </MenuItem>
                  <MenuItem value='paid'> Pagada </MenuItem>
              </Select>
          )
      } 
    },
    {
      field: 'isPaid',
      headerName: 'Pagada',
      renderCell: ({ row }: GridValueGetterParams)=> {
        return row.isPaid
          ? ( <Chip variant='outlined' label='Pagada' color='success' />)
          : ( <Chip variant='outlined' label='Pendiente' color='error' />)
      }
    },
    { field: 'noProducts', headerName: 'No. Productos', align:'center', width: 150 },
    {
      field: 'check',
      headerName: 'Ver Orden',
      renderCell: ({ row }: GridValueGetterParams)=> {
        return (
          <a href={ `/admin/orders/${ row.id }` } target="_blank" rel='noreferrer'>
            Ver orden
          </a>
        )
      }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 300},
  ];
  

  const rows = orders.map( order => ({
    id        : order._id,
    email     : (order.user as IUser).email,
    name      : (order.user as IUser).name,
    total     : order.total,
    changePaid: order.isPaid ? 'paid' : 'pending' ,
    isPaid    : order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt
  }));

  return (
    <AdminLayout
        title={'Ordenes'}
        subTitle={'Mantenimiento de ordenes'}
        icon={ < ConfirmationNumberOutlined />}
    >
      <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />

            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default OrdersPage