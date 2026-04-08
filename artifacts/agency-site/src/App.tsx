import { Switch, Route, Router as WouterRouter, useParams } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import Home from "@/pages/Home";
import Portfolio from "@/pages/Portfolio";
import About from "@/pages/About";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import NicheHub from "@/pages/NicheHub";
import NicheTemplate from "@/pages/niche/NicheTemplate";
import { getNicheBySlug } from "@/pages/niche/data";
import NotFound from "@/pages/not-found";
import Start from "@/pages/Start";

const queryClient = new QueryClient();

function NichePage() {
  const { niche: slug } = useParams<{ niche: string }>();
  const data = getNicheBySlug(slug ?? "");
  if (!data) return <NotFound />;
  return <NicheTemplate niche={data} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/about" component={About} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/contact" component={Contact} />
      <Route path="/start" component={Start} />
      <Route path="/for" component={NicheHub} />
      <Route path="/for/:niche" component={NichePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Analytics />
    </QueryClientProvider>
  );
}

export default App;
