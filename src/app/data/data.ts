type Cat = {label: string; href: string; img: string};

export const DATA = {
    MENS: {
      collections: [
        {label: "Twin Sets", href: "/collections/twin-sets", img: "/photo.webp"},
        {label: "Gymwear", href: "/collections/gymwear", img: "/photo.webp"},
        {
          label: "Tracksuits",
          href: "/collections/tracksuits",
          img: "/photo.webp",
        },
        {
          label: "T-Shirts",
          href: "/collections/mens-tshirts",
          img: "/photo.webp",
        },
      ] as Cat[],
      recommended: [
        {
          label: "Hoodie Pro",
          href: "/men/p/hoodie-pro",
          img: "/photo.webp",
          price: "150 GBP",
        },
        {
          label: "Joggers Core",
          href: "/men/p/joggers-core",
          img: "/photo.webp",
          price: "150 GBP",
        },
        {
          label: "Tank Elite",
          href: "/men/p/tank-elite",
          img: "/photo.webp",
          price: "150 GBP",
        },
        {
          label: "Zip Jacket",
          href: "/men/p/zip-jacket",
          img: "/photo.webp",
          price: "150 GBP",
        },
      ],
    },
    WOMENS: {
      collections: [
        {label: "Tops", href: "/collections/tops", img: "/photo1.webp"},
        {label: "Leggings", href: "/collections/leggings", img: "/photo1.webp"},
        {label: "Outerwear", href: "/collections/outerwear", img: "/photo1.webp"},
        {
          label: "T-Shirts",
          href: "/collections/women-tshirts",
          img: "/photo1.webp",
        },
      ] as Cat[],
      recommended: [
        {
          label: "Seamless Set",
          href: "/women/p/seamless-set",
          img: "/photo1.webp",
          price: "150 GBP",
        },
        {
          label: "Crop Hoodie",
          href: "/women/p/crop-hoodie",
          img: "/photo1.webp",
          price: "150 GBP",
        },
        {
          label: "Lite Leggings",
          href: "/women/p/lite-leggings",
          img: "/photo1.webp",
          price: "150 GBP",
        },
        {
          label: "Windbreaker",
          href: "/women/p/windbreaker",
          img: "/photo1.webp",
          price: "150 GBP",
        },
      ],
    },
  };