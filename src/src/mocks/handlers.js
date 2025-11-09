export function installApiMocks() {
  const originalFetch = window.fetch;
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.startsWith("/api/")) {
      const path = url.replace("/api", "");
      if (path === "/subscription") return new Response(JSON.stringify({ status: "none" }), { status: 200, headers: { "Content-Type": "application/json" } });
      if (path === "/programs") return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
      if (path === "/courses") return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
      
      if (path === "/reference/subscription-tiers") {
        return new Response(JSON.stringify([{code:"free",name:"Free"},{code:"premium",name:"Premium"}]), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (path === "/reference/genders") {
        return new Response(JSON.stringify([{code:"male",name:"Male"},{code:"female",name:"Female"},{code:"other",name:"Other"}]), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (path === "/reference/body-types") {
        return new Response(JSON.stringify([{code:"ectomorph",name:"Ectomorph"},{code:"mesomorph",name:"Mesomorph"},{code:"endomorph",name:"Endomorph"}]), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (path === "/reference/ranks") {
        return new Response(JSON.stringify([{code:"bronze",name:"Bronze"},{code:"silver",name:"Silver"},{code:"gold",name:"Gold"}]), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (path.startsWith("/reference/countries")) {
        return new Response(JSON.stringify([{iso2:"ZA",name:"South Africa"}]), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (path.startsWith("/reference/provinces")) {
        return new Response(JSON.stringify([{name:"Gauteng"},{name:"Western Cape"},{name:"KwaZulu-Natal"}]), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (path.startsWith("/reference/cities")) {
        return new Response(JSON.stringify([{name:"Johannesburg"},{name:"Pretoria"},{name:"Soweto"}]), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      return new Response("Not Found", { status: 404 });
    }
    return originalFetch(input, init);
  };
}

