import { GetStaticProps } from 'next';
import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe'

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home( { product }: HomeProps ) {
  

  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏🏼 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br/>
            <span>for { product.amount } month</span>
          </p>          
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  )
}

// SSR use export const getServerSideProps: GetServerSideProps

// SSG use 
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_SUBSCRIPE_PRICE_ID,
  /* { expand: ['product'] } -> essa linha serve para pegar mais dados referentes ao produto como o nome*/ 
  ) 

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100 ), //convertendo o preço que vem centavos para o valor real
  }

  //quando utilizarmos o SSG incluimos a props revalidate com o tempo para a página estatica mudar
  const revalidadeTime = 60 * 60 * 24 // 24 hours
  return { 
    props: {
      product,
    },
    revalidate: revalidadeTime,
  }
}