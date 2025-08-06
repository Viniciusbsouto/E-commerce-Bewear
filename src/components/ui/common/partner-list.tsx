import Image from "next/image";

const svgs = [
  {
    name: "Nike",
    image: "/Nike.svg",
  },
  {
    name: "Adidas",
    image: "/Adidas.svg",
  },
  {
    name: "Puma",
    image: "/Puma.svg",
  },
  {
    name: "New Balance",
    image: "/NB.svg",
  },
  {
    name: "Converse",
    image: "/Converse.svg",
  },
  {
    name: "Zara",
    image: "/Zara.svg",
  },
  {
    name: "Polo",
    image: "/PRL.svg",
  },
];

const PartnerBrands = () => {
  return (
    <>
      <h3 className="px-5 font-semibold">Marcas parceiras</h3>
      <div className="flex w-full gap-4 overflow-x-auto overflow-y-hidden px-5 [&::-webkit-scrollbar]:hidden">
        {svgs.map((brand, index) => (
          <div
            key={index}
            className="flex h-32 w-32 max-w-[200px] shrink-0 flex-col items-center rounded-xl border bg-white shadow transition hover:shadow-md"
          >
            <div className="flex flex-1 items-center justify-center">
              <Image
                src={brand.image}
                alt={brand.name}
                width={50}
                height={50}
              />
            </div>
            <div className="pb-3 text-sm font-medium text-gray-700">
              {brand.name}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PartnerBrands;
