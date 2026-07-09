export type Language = "pt" | "es" | "en";

export const LANGUAGE_STORAGE_KEY = "mc_lang";

export const languageLabel: Record<Language, string> = {
  pt: "Português",
  es: "Espanhol",
  en: "Inglês",
};

type Dict = Record<string, string>;

const dict: Record<Language, Dict> = {
  pt: {
    "login.noAccount": "Ainda não tem uma conta?",
    "login.freeTrial": "Comece o teste grátis",
    "login.hello": "Olá!",
    "login.or": "OU",
    "login.email": "Email",
    "login.password": "Senha",
    "login.forgot": "Esqueceu sua senha?",
    "login.remember14": "Lembrar deste dispositivo por 14 dias",
    "login.advance": "Avançar",
    "login.advancing": "Avançando…",
    "login.sso": "Entrar com SSO",
    "login.invalid": "Usuário ou senha inválidos.",
    "login.testCreds": "Credenciais do teste: admin / admin123",
    "login.showPassword": "Mostrar senha",
    "login.hidePassword": "Ocultar senha",

    "home.products": "Produtos",
    "home.productsHint": "Clique em “Adicionar” para criar/manter o carrinho da sua sessão.",
    "home.itemsCount": "{count} itens",
    "home.loading": "Carregando…",
    "home.noProducts": "Nenhum produto encontrado.",
    "home.inCart": "No carrinho",
    "home.add": "Adicionar",
    "home.cart": "Carrinho",
    "home.cartEmpty": "Seu carrinho está vazio.",
    "home.cartUnavailable": "Carrinho indisponível.",
    "home.loadingCart": "Carregando carrinho…",
    "home.total": "Total",
    "home.subtotal": "Subtotal",
    "home.clear": "Limpar",
    "home.plusOne": "+1",
    "home.remove": "Remover",
    "home.logout": "Sair",
    "home.errorTitle": "Erro",
    "home.tip": "Dica: se der CORS, habilite credenciais no backend e use uma origem tipo http://localhost:3001.",
    "home.headerTitle": "Carrinho de compras - RD Station",
  },
  es: {
    "login.noAccount": "¿Aún no tienes una cuenta?",
    "login.freeTrial": "Comienza la prueba gratis",
    "login.hello": "¡Hola!",
    "login.or": "O",
    "login.email": "Email",
    "login.password": "Contraseña",
    "login.forgot": "¿Olvidaste tu contraseña?",
    "login.remember14": "Recordar este dispositivo durante 14 días",
    "login.advance": "Continuar",
    "login.advancing": "Continuando…",
    "login.sso": "Entrar con SSO",
    "login.invalid": "Usuario o contraseña inválidos.",
    "login.testCreds": "Credenciales de prueba: admin / admin123",
    "login.showPassword": "Mostrar contraseña",
    "login.hidePassword": "Ocultar contraseña",

    "home.products": "Productos",
    "home.productsHint": "Haz clic en “Agregar” para crear/mantener el carrito de tu sesión.",
    "home.itemsCount": "{count} ítems",
    "home.loading": "Cargando…",
    "home.noProducts": "No se encontraron productos.",
    "home.inCart": "En el carrito",
    "home.add": "Agregar",
    "home.cart": "Carrito",
    "home.cartEmpty": "Tu carrito está vacío.",
    "home.cartUnavailable": "Carrito no disponible.",
    "home.loadingCart": "Cargando carrito…",
    "home.total": "Total",
    "home.subtotal": "Subtotal",
    "home.clear": "Limpiar",
    "home.plusOne": "+1",
    "home.remove": "Eliminar",
    "home.logout": "Salir",
    "home.errorTitle": "Error",
    "home.tip":
      "Consejo: si aparece CORS, habilita credenciales en el backend y usa un origen como http://localhost:3001.",
    "home.headerTitle": "Carrito de compras - RD Station",
  },
  en: {
    "login.noAccount": "Don't have an account yet?",
    "login.freeTrial": "Start free trial",
    "login.hello": "Hi!",
    "login.or": "OR",
    "login.email": "Email",
    "login.password": "Password",
    "login.forgot": "Forgot your password?",
    "login.remember14": "Remember this device for 14 days",
    "login.advance": "Continue",
    "login.advancing": "Continuing…",
    "login.sso": "Sign in with SSO",
    "login.invalid": "Invalid username or password.",
    "login.testCreds": "Test credentials: admin / admin123",
    "login.showPassword": "Show password",
    "login.hidePassword": "Hide password",

    "home.products": "Products",
    "home.productsHint": "Click “Add” to create/keep your session cart.",
    "home.itemsCount": "{count} items",
    "home.loading": "Loading…",
    "home.noProducts": "No products found.",
    "home.inCart": "In cart",
    "home.add": "Add",
    "home.cart": "Cart",
    "home.cartEmpty": "Your cart is empty.",
    "home.cartUnavailable": "Cart unavailable.",
    "home.loadingCart": "Loading cart…",
    "home.total": "Total",
    "home.subtotal": "Subtotal",
    "home.clear": "Clear",
    "home.plusOne": "+1",
    "home.remove": "Remove",
    "home.logout": "Sign out",
    "home.errorTitle": "Error",
    "home.tip":
      "Tip: if you hit CORS, enable credentials on the backend and use an origin like http://localhost:3001.",
    "home.headerTitle": "Shopping cart - RD Station",
  },
};

export function getLanguage(): Language {
  if (typeof window === "undefined") return "pt";
  const raw = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (raw === "es" || raw === "en" || raw === "pt") return raw;
  return "pt";
}

export function setLanguage(lang: Language) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

export function t(lang: Language, key: string, vars?: Record<string, string | number>) {
  const base = dict[lang]?.[key] ?? dict.pt[key] ?? key;
  if (!vars) return base;
  return Object.keys(vars).reduce(
    (acc, k) => acc.replaceAll(`{${k}}`, String(vars[k])),
    base
  );
}

