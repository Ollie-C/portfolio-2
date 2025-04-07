import SimpleHero from '../components/SimpleHero';
import Layout from '../components/Layout/Layout';
import HomeFeatures from '../components/HomeFeatures';
export default function IndexPage() {
  return (
    <Layout>
      <SimpleHero />
      <HomeFeatures />
    </Layout>
  );
}
