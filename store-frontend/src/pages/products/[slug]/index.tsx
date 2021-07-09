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
} from "@material-ui/core";
import { Product } from "../../../model";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import http from "../../../http";
import axios from "axios";

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
  return (
    <div>
      <Head>
        <title>{product.name} - Detalhes do produto</title>
      </Head>
      <Card>
        <CardHeader
          title={product.name.toUpperCase()}
          subheader={`R$ ${product.price}`}
        />
        <CardActions>
          <Link
            href="/products/[slug]/order"
            as={`/products/${product.slug}/order`}
            passHref
          >
            <Button size="small" color="primary" component="a">
              Comprar
            </Button>
          </Link>
        </CardActions>
        <CardMedia style={{ paddingTop: "56%" }} image={product.image_url} />
        <CardContent>
          <Typography component="p" variant="body2" color="textSecondary">
            {product.description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;

export const getStaticProps: GetStaticProps<
  ProductDetailPageProps,
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
      revalidate: 2 * 60,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    } else {
      throw e;
    }
  }
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const { data: products } = await http.get("products");
  const paths = products.map((p: Product) => ({
    params: { slug: p.slug },
  }));

  return { paths, fallback: "blocking" };
};
