import { NextResponse } from "next/server";
import connect from "../../../db";
import Product from "@/models/Product";
import { faker } from "@faker-js/faker";
import { generateEmbedding } from "../../utils/embedding";

export const POST = async (req) => {
  try {
    await connect();

    const products = [];

    // Kategoriler ve marka listeleri
    const categories = ["Computer", "Phone"];
    const phoneBrands = ["iPhone", "Samsung Galaxy", "Huawei P", "Xiaomi", "Google Pixel"];
    const computerBrands = ["MacBook", "Dell XPS", "HP Spectre", "Lenovo ThinkPad", "Asus ZenBook"];

    for (let i = 0; i < 200; i++) {
      const selectedCategory = faker.helpers.arrayElement(categories);

      // Seçilen kategoriye göre rastgele marka belirle
      let brand;
      if (selectedCategory === "Computer") {
        brand = faker.helpers.arrayElement(computerBrands);
      } else {
        brand = faker.helpers.arrayElement(phoneBrands);
      }

      // Ürün ismini oluştur (örnek: "Samsung Galaxy Wireless Chair")
      const name = `${brand} ${faker.commerce.productName()}`;

      const details = faker.commerce.productDescription();
      const price = parseFloat(faker.commerce.price(10, 500, 2));
      const discountPercentage = faker.datatype.boolean()
        ? faker.number.int({ min: 5, max: 50 })
        : 0;
      const discountedPrice = discountPercentage
        ? price - (price * discountPercentage) / 100
        : null;
      const userID = faker.string.uuid();
      const imgURL = faker.image.url();
      const boxPhoto = faker.image.url();

    
      const productText = `${name} ${details} ${selectedCategory}`;
      const embedding = await generateEmbedding(productText);

      const product = {
        userID,
        imgURL,
        name,
        price,
        discountedPrice,
        details,
        category: selectedCategory,
        discountPercentage,
        boxPhoto,
        embedding,
      };

      products.push(product);
    }

    await Product.insertMany(products);

    return new NextResponse(
      JSON.stringify({ message: "200 random products created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating random products:", error);
    return new NextResponse(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
};
