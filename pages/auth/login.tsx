import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { getProviders, getSession, signIn } from 'next-auth/react';

import { Box, Button, Grid, Link, TextField, Typography, Chip, Divider } from '@mui/material';
import { AuthLayout } from '../../components/layouts'
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';

type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {

    const router = useRouter();
  
    // const { loginUser } = useContext(AuthContext);
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    
    const [showError, setShowError] = useState(false);
    const [blockButton, setBlockButton] = useState(false);

    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
      getProviders().then( prov => {
        // console.log({prov});
        setProviders(prov)
      })
    }, [])
    
    
    const onLoginUser = async ( { email, password }: FormData )=> {
      setBlockButton(true);
      setShowError(false);
    
    //   const isValidLogin = await loginUser(email, password);
    //   if( !isValidLogin ) {
    //       setShowError(true);
    //       setBlockButton(false);
    //       setTimeout(() => {
    //           setShowError(false)
    //       }, 3000);
    //       return;
    //   }

    //   const destination = router.query.p?.toString() || '/'
    //   router.replace(destination);
    await signIn('credentials', { email, password });
    setBlockButton(true);
    }
  return (
    <AuthLayout title={'Ingresar'}>
        <form onSubmit={ handleSubmit( onLoginUser) } noValidate>
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component="h1">Iniciar Sesión</Typography>
                        <Chip 
                            label="No reconocemos a este usuario / contraseña"
                            color="error"
                            icon={ <ErrorOutline />}
                            className="fadeIn"
                            sx={{ display: showError ? 'flex': 'none'}}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                            type="email"
                            label="Correo" 
                            variant="filled" 
                            fullWidth
                            { ...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
                            })} 
                            error = {!!errors.email}
                            helperText= { errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label="Contraseña" 
                            type='password' 
                            variant="filled" 
                            fullWidth 
                            { ...register('password', {
                                required: 'Este campo es requerido',
                                minLength: { value:6, message: 'Minimo 6 caracteres'}
                            })} 
                            error = {!!errors.password}
                            helperText= { errors.password?.message }
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button 
                            color="secondary"
                            type= "submit" 
                            className='circular-btn' 
                            size='large' 
                            fullWidth
                            disabled={blockButton}
                            
                        >
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink 
                            href={ router.query.p ? `/auth/register?p=${ router.query.p }` : '/auth/register' }
                            passHref
                        >
                            <Link underline='always'>
                                ¿No tienes cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
                <Grid item xs={12} display='flex' flexDirection="column" justifyContent='end'>
                    <Divider sx={{ width: '100%', mb: 2}} />
                    {
                        Object.values( providers ).map(( provider: any)=> { //Object.values permite mapear un objecto como si fuera array
                            
                            if( provider.id === 'credentials') return (<div key="credentilas"></div>)
                            
                            return (
                                <Button
                                    key={ provider.id}
                                    variant="outlined"
                                    fullWidth
                                    color="secondary"
                                    sx={{ mb:1 }}
                                    onClick={ ()=> signIn(provider.id)}
                                >
                                    { provider.name }
                                </Button>
                            )
                        })
                    }
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession( { req });

    const { p = '/'} = query;

    if( session ) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default LoginPage