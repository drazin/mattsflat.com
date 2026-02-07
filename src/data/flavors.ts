export interface Flavor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  profile: string;
  color: string;
  isHero: boolean;
}

export const flavors: Flavor[] = [
  {
    id: 'original-flat',
    name: 'The Original Flat',
    tagline: 'All the taste. None of the assault.',
    description: 'Classic cola the way it was meant to be tasted — without the carbonation getting in the way. Bold. Smooth. Revolutionary in its simplicity.',
    profile: 'Classic Cola',
    color: '#F5E6C8',
    isHero: true,
  },
  {
    id: 'barely-berry',
    name: 'Barely Berry',
    tagline: 'Bursting with flavor. Not your stomach.',
    description: 'A lush mix of berries that actually lets you taste them. Wild, sweet, and impossibly smooth.',
    profile: 'Mixed Berry',
    color: '#DDD0F0',
    isHero: false,
  },
  {
    id: 'citrus-mistress',
    name: 'Citrus Mistress',
    tagline: "She's smooth and she knows it.",
    description: "Lemon meets lime in a drink that's confident, refreshing, and won't make you wince.",
    profile: 'Lemon-Lime',
    color: '#FFF3C4',
    isHero: false,
  },
  {
    id: 'peach-please',
    name: 'Peach, Please',
    tagline: "So smooth it's almost suspicious.",
    description: 'Ripe peach flavor that glides. No burn. No bite. Just pure, velvety peach.',
    profile: 'Smooth Peach',
    color: '#FDDCB5',
    isHero: false,
  },
  {
    id: 'mint-to-be',
    name: 'Mint to Be',
    tagline: 'The drink you were destined for.',
    description: 'Cool spearmint with a whisper of lime. Refreshing in a way that carbonation could never be.',
    profile: 'Spearmint + Lime',
    color: '#C8F0E0',
    isHero: false,
  },
  {
    id: 'summit-chill',
    name: 'Summit Chill',
    tagline: 'We climbed to the top and took a nap.',
    description: 'Extreme citrus flavor, maximum intensity, zero eruption. All the rush of the peak without the turbulence.',
    profile: 'Extreme Citrus',
    color: '#D4F5C0',
    isHero: false,
  },
  {
    id: 'grape-escape',
    name: 'Grape Escape',
    tagline: 'Finally free from the fizz.',
    description: "Bold, unapologetic grape flavor liberated from the carbonation that's been holding it hostage.",
    profile: 'Bold Grape',
    color: '#D8C4F0',
    isHero: false,
  },
];
