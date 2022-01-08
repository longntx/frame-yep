import dynamic from 'next/dynamic';

const LazyFrameImage = dynamic(() => import('../components/FrameImage'), {
  ssr: false,
});
function HomePage() {
  return <LazyFrameImage />;
}

export default HomePage;
