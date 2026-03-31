import Image from "next/image";
import React from "react";

const cards = [
  {
    title: "სწრაფი მიწოდება",
    description: "საჰაერო გზით ევროპიდან 3 დღეში",
    image: "/why/1.png",
    alt: "სწრაფი მიწოდების ილუსტრაცია",
  },
  {
    title: "უსაფრთხო ტრანსპორტირება",
    description: "შენი ამანათი დაცულია სრულად",
    image: "/why/2.png",
    alt: "უსაფრთხო ტრანსპორტირების ილუსტრაცია",
  },
  {
    title: "ხელმისაწვდომი ტარიფები",
    description: "საუკეთესო ბალანსი ფასსა და ხარისხს შორის",
    image: "/why/3.png",
    alt: "ხელმისაწვდომი ტარიფების ილუსტრაცია",
  },
];

const Why = () => {
  return (
  <section className=" md:mt-[200px] md:mt-14 flex w-full items-center justify-center overflow-hidden flex-col pb-0 ">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-black md:text-3xl">რატომ ჩვენ</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-[28px] border border-[#e8e9ff] bg-[#f7f8ff] px-5 pb-7 pt-6 text-center shadow-[0_14px_30px_-24px_rgba(58,91,255,0.55)] transition duration-300"
          >
            <div className="relative mx-auto mb-4 h-[250px] w-[250px]">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                className="object-contain transition duration-300 group-hover:scale-[1.06]"
              />
            </div>
            <h3 className="text-[24px] font-extrabold leading-tight text-[#3a5bff] md:text-[28px]">{card.title}</h3>
            <div className="mx-auto my-4 h-px w-4/5 bg-[#d8daf5]" />
            <p className="mx-auto max-w-[22ch] text-[19px] leading-snug text-black md:text-[22px]">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Why;