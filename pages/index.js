import dynamic from 'next/dynamic';

const LazyFrameImage = dynamic(() => import('../components/FrameImage'), {
  ssr: false,
});
function HomePage() {
  return (
    <>
      <div className="container mx-auto h-100 flex align-center justify-center flex-col">
        <LazyFrameImage />
      </div>
    </>
  );
}

export default HomePage;
