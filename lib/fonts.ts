import {
  Cormorant_Garamond,
  Lato,
  Playfair_Display,
  Inter,
  Great_Vibes,
  Fraunces,
  Archivo_Black,
  Parisienne,
  Nunito,
  Allura,
  Montserrat,
  Sacramento,
  Poppins,
  Orbitron,
  Rajdhani,
  Press_Start_2P,
  VT323,
  Bebas_Neue,
  Amatic_SC,
  Merriweather,
  Lora,
} from 'next/font/google';

export const fontCormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const fontLato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

export const fontPlayfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export const fontInter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const fontGreatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
  display: 'swap',
});

export const fontFraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const fontArchivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-archivo-black',
  display: 'swap',
});

export const fontParisienne = Parisienne({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-parisienne',
  display: 'swap',
});

export const fontNunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
});

export const fontAllura = Allura({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-allura',
  display: 'swap',
});

export const fontMontserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const fontSacramento = Sacramento({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sacramento',
  display: 'swap',
});

export const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const fontOrbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const fontRajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

export const fontPressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start-2p',
  display: 'swap',
});

export const fontVT323 = VT323({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-vt323',
  display: 'swap',
});

export const fontBebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

export const fontAmaticSC = Amatic_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-amatic-sc',
  display: 'swap',
});

export const fontMerriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const fontLora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
});

export const themeFontsVariables = [
  fontCormorantGaramond.variable,
  fontLato.variable,
  fontPlayfair.variable,
  fontInter.variable,
  fontGreatVibes.variable,
  fontFraunces.variable,
  fontArchivoBlack.variable,
  fontParisienne.variable,
  fontNunito.variable,
  fontAllura.variable,
  fontMontserrat.variable,
  fontSacramento.variable,
  fontPoppins.variable,
  fontOrbitron.variable,
  fontRajdhani.variable,
  fontPressStart2P.variable,
  fontVT323.variable,
  fontBebasNeue.variable,
  fontAmaticSC.variable,
  fontMerriweather.variable,
  fontLora.variable,
].join(' ');
