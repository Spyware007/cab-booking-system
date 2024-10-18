import Image from "next/image";
function DriveWithUs() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/banners/service1.png"
              alt="Drive with Uber"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-4">
              Drive when you want, make what you need
            </h2>
            <p className="mb-6">
              Make money on your schedule with deliveries or rides—or both. You
              can use your own car or choose a rental through Uber.
            </p>
            <button className="bg-black text-white font-bold py-3 px-6 rounded">
              Get started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Business() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/banners/service3.png"
              alt="Uber for Business"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
          <div className="md:w-1/2 md:pr-12">
            <h2 className="text-3xl font-bold mb-4">Uber for Business</h2>
            <p className="mb-6">
              Transform the way your company moves and feeds its people with
              Uber for Business.
            </p>
            <button className="bg-black text-white font-bold py-3 px-6 rounded">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { DriveWithUs, Business };
