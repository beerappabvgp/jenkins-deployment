import {prismaClient} from "db/client";

export default async function Home() {
  const users = await prismaClient.user.findMany();
  
  return (
    <div>
      Hi there !!!  👋👋👋👋👋👋
      <br />
      <br />
      <br />
      {JSON.stringify(users)}
    </div>
  );
}

// export const dynamic = 'force-dynamic'