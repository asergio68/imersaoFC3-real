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
  Grid,
} from "@material-ui/core";
import Link from "next/link";
import { Product } from "../model";
import { GetServerSideProps, NextPage } from "next";
import http from "../http";

interface ProductsListPageProps {
  products: Product[];
}

const ProductsListPage: NextPage<ProductsListPageProps> = ({ products }) => {
  return (
    <div>
      <Head>
        <title>Listagem de produtos</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Produtos
      </Typography>
      <Grid container spacing={4}>
        {products.map((p, i) => (
          <Grid key={i} item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia style={{ paddingTop: "56%" }} image={p.image_url} />
              <CardContent>
                <Typography component="h2" variant="h5" gutterBottom>
                  {p.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Link
                  href="/products/[slug]"
                  as={`/products/${p.slug}`}
                  passHref
                >
                  <Button size="small" color="primary" component="a">
                    Detalhes
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductsListPage;

export const getServerSideProps: GetServerSideProps<ProductsListPageProps> =
  async (context) => {
    const { data: products } = await http.get("products");
    // console.log(products);

    return {
      props: {
        products,
      },
    };
  };