import { getServices } from '@/utils/api';
import Layout from '@/components/layout/Layout';
import { getCategoriesbySlug } from '@/utils/api';
import ServiceAbout from '@/components/sections/services/ServiceAbout';
import ServiceGrid from '@/components/sections/services/ServiceGrid';
export default async function ServicesPage() {
  const category = 'predictive-maintenance';
  const categoryData = (await getCategoriesbySlug(category)) || [];

  const response = await getServices({
    status: 'active',
    scope: 'service',
  });
  const services = response?.data?.items || [];

  return (
    <Layout breadcrumbTitle="Services">
      <ServiceAbout details={categoryData.data} />
      <ServiceGrid services={services} />
    </Layout>
  );
}
