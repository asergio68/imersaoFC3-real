import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Grid,
  Box,
} from "@material-ui/core";
import { CreditCard, Product } from "../../../model";
import { GetServerSideProps, NextPage } from "next";
import http from "../../../http";
import axios from "axios";
import { TextFields } from "@material-ui/icons";
import { useForm } from "react-hook-form";

interface OrderPageProps {
  product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({ product }) => {
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data: CreditCard) => {
    const orderBase = {
      credit_card: data,
      items: [{ product_id: product.id, quantity: 1 }],
    };
    console.log(orderBase);
    const { data: order } = await http.post("orders", orderBase);
    console.log(order);
  };

  return (
    <div>
      <Head>
        <title>Pagamento</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Checkout
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={product.image_url} />
        </ListItemAvatar>
        <ListItemText
          primary={product.name}
          secondary={`R$ ${product.price}`}
        />
      </ListItem>
      <Typography component="h2" variant="h6" gutterBottom>
        Pague com seu cartão de crédito
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField {...register("name")} label="Nome" required fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("number")}
              type="number"
              label="Número"
              inputProps={{ maxLength: 16 }}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("cvv")}
              type="number"
              label="CVV"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  {...register("expiration_month")}
                  type="number"
                  label="Experiração - Mês"
                  required
                  fullWidth
                  onChange={(e) =>
                    setValue("expiration_month", parseInt(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...register("expiration_year")}
                  type="number"
                  label="Experiração - Ano"
                  required
                  fullWidth
                  onChange={(e) =>
                    setValue("expiration_year", parseInt(e.target.value))
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={3}>
          <Button type="submit" variant="contained" fullWidth color="primary">
            Pagar
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps<
  OrderPageProps,
  { slug: string }
> = async (context) => {
  try {
    const { slug } = context.params!;
    const { data: product } = await http.get(`products/${slug}`);
    console.log(product);

    return {
      props: {
        product,
      },
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    } else {
      throw e;
    }
  }
};
