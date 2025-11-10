import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Plant {
  id: number;
  name: string;
  category: 'fruit' | 'berry' | 'decorative';
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  height: string;
}

const plants: Plant[] = [
  {
    id: 1,
    name: 'Яблоня Антоновка',
    category: 'fruit',
    price: 850,
    image: 'https://cdn.poehali.dev/projects/a2f5c400-a62b-4a6a-b81c-31a602602ded/files/6fdd05d8-59c9-4502-8b43-177d363f5042.jpg',
    description: 'Зимний сорт, морозостойкий, урожайный',
    inStock: true,
    height: '1.5-2м'
  },
  {
    id: 2,
    name: 'Вишня Владимирская',
    category: 'fruit',
    price: 650,
    image: 'https://cdn.poehali.dev/projects/a2f5c400-a62b-4a6a-b81c-31a602602ded/files/63348d94-4a51-4e73-807c-a8c56a78480b.jpg',
    description: 'Старинный русский сорт, сладкая',
    inStock: true,
    height: '1.2-1.5м'
  },
  {
    id: 3,
    name: 'Груша Лесная красавица',
    category: 'fruit',
    price: 900,
    image: 'https://cdn.poehali.dev/projects/a2f5c400-a62b-4a6a-b81c-31a602602ded/files/1d817802-e471-4e11-abb3-e7362ec98b8b.jpg',
    description: 'Летний сорт, очень сочная и ароматная',
    inStock: true,
    height: '1.5-2м'
  },
  {
    id: 4,
    name: 'Слива Венгерка',
    category: 'fruit',
    price: 700,
    image: 'https://cdn.poehali.dev/projects/a2f5c400-a62b-4a6a-b81c-31a602602ded/files/6fdd05d8-59c9-4502-8b43-177d363f5042.jpg',
    description: 'Универсальный сорт для свежего потребления',
    inStock: true,
    height: '1.5м'
  },
  {
    id: 5,
    name: 'Смородина черная',
    category: 'berry',
    price: 400,
    image: 'https://cdn.poehali.dev/projects/a2f5c400-a62b-4a6a-b81c-31a602602ded/files/63348d94-4a51-4e73-807c-a8c56a78480b.jpg',
    description: 'Крупноплодная, витаминная',
    inStock: true,
    height: '0.5-0.8м'
  },
  {
    id: 6,
    name: 'Малина ремонтантная',
    category: 'berry',
    price: 350,
    image: 'https://cdn.poehali.dev/projects/a2f5c400-a62b-4a6a-b81c-31a602602ded/files/1d817802-e471-4e11-abb3-e7362ec98b8b.jpg',
    description: 'Плодоносит до заморозков',
    inStock: true,
    height: '0.6-1м'
  }
];

export default function Index() {
  const [cart, setCart] = useState<{ plant: Plant; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState('home');

  const addToCart = (plant: Plant) => {
    const existing = cart.find(item => item.plant.id === plant.id);
    if (existing) {
      setCart(cart.map(item =>
        item.plant.id === plant.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { plant, quantity: 1 }]);
    }
    toast({
      title: 'Добавлено в корзину',
      description: `${plant.name} добавлен в вашу корзину`,
    });
  };

  const removeFromCart = (plantId: number) => {
    setCart(cart.filter(item => item.plant.id !== plantId));
  };

  const updateQuantity = (plantId: number, delta: number) => {
    setCart(cart.map(item =>
      item.plant.id === plantId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.plant.price * item.quantity, 0);
  const deliveryCost = totalPrice > 5000 ? 0 : 500;
  const finalPrice = totalPrice + deliveryCost;

  const filteredPlants = selectedCategory === 'all'
    ? plants
    : plants.filter(plant => plant.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Sprout" className="text-primary" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-primary">КФХ Бракнис</h1>
                <p className="text-xs text-muted-foreground">КФХ по продаже саженцев</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => setActiveSection('home')}>Главная</Button>
              <Button variant="ghost" onClick={() => setActiveSection('about')}>О хозяйстве</Button>
              <Button variant="ghost" onClick={() => setActiveSection('catalog')}>Каталог</Button>
              <Button variant="ghost" onClick={() => setActiveSection('delivery')}>Доставка</Button>
              <Button variant="ghost" onClick={() => setActiveSection('contacts')}>Контакты</Button>
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                  <SheetDescription>
                    {cart.length === 0 ? 'Ваша корзина пуста' : `Товаров в корзине: ${cart.length}`}
                  </SheetDescription>
                </SheetHeader>
                
                {cart.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {cart.map(item => (
                      <Card key={item.plant.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img src={item.plant.image} alt={item.plant.name} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.plant.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.plant.price} ₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.plant.id, -1)}>
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.plant.id, 1)}>
                                  <Icon name="Plus" size={14} />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.plant.id)} className="ml-auto">
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Товары:</span>
                        <span>{totalPrice} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Доставка:</span>
                        <span className={deliveryCost === 0 ? 'text-green-600 font-semibold' : ''}>
                          {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}
                        </span>
                      </div>
                      {totalPrice < 5000 && totalPrice > 0 && (
                        <p className="text-xs text-muted-foreground">
                          До бесплатной доставки: {5000 - totalPrice} ₽
                        </p>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Итого:</span>
                        <span>{finalPrice} ₽</span>
                      </div>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {activeSection === 'home' && (
        <>
          <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
            <div className="container mx-auto px-4 text-center animate-fade-in">
              <h2 className="text-5xl font-bold mb-6">Качественные саженцы от производителя</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Выращиваем здоровые плодовые деревья и ягодные кустарники. 
                Доставляем по всей России с гарантией приживаемости.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" variant="secondary" onClick={() => setActiveSection('catalog')}>
                  <Icon name="ShoppingBag" size={20} className="mr-2" />
                  Перейти в каталог
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                  <Icon name="Phone" size={20} className="mr-2" />
                  Связаться с нами
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-3xl font-bold text-center mb-12">Популярные саженцы</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plants.slice(0, 3).map((plant, index) => (
                  <Card key={plant.id} className="hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <img src={plant.image} alt={plant.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                      <CardTitle>{plant.name}</CardTitle>
                      <CardDescription>{plant.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary">{plant.price} ₽</p>
                          <p className="text-sm text-muted-foreground">Высота: {plant.height}</p>
                        </div>
                        <Badge variant={plant.inStock ? 'default' : 'secondary'}>
                          {plant.inStock ? 'В наличии' : 'Под заказ'}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => addToCart(plant)}>
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h3 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Award" size={32} className="text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Качество</h4>
                  <p className="text-muted-foreground">Все саженцы проходят строгий контроль и имеют гарантию</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Truck" size={32} className="text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Доставка</h4>
                  <p className="text-muted-foreground">Бережная доставка по всей России, бесплатно от 5000 ₽</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Heart" size={32} className="text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Поддержка</h4>
                  <p className="text-muted-foreground">Консультируем по уходу за саженцами после покупки</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === 'about' && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-bold mb-8">О нашем хозяйстве</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-4">
                КФХ "СадЭко" занимается выращиванием плодовых деревьев и ягодных кустарников с 2010 года. 
                Наше хозяйство расположено в экологически чистом районе, что гарантирует высокое качество саженцев.
              </p>
              <p className="text-lg mb-4">
                Мы используем современные технологии выращивания и отбираем только лучшие сорта, 
                адаптированные к российским климатическим условиям.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="TreePine" className="text-primary" />
                      Наш питомник
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Площадь питомника: 15 га</p>
                    <p>Ежегодное производство: 50 000+ саженцев</p>
                    <p>Ассортимент: более 100 сортов</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Shield" className="text-primary" />
                      Гарантии
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Все саженцы с сертификатами</p>
                    <p>Гарантия приживаемости 90%</p>
                    <p>Замена бракованных саженцев</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'catalog' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Каталог саженцев</h2>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
              <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-grid">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="fruit">Плодовые</TabsTrigger>
                <TabsTrigger value="berry">Ягодные</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPlants.map((plant) => (
                <Card key={plant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <img src={plant.image} alt={plant.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <CardTitle>{plant.name}</CardTitle>
                    <CardDescription>{plant.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">{plant.price} ₽</p>
                        <p className="text-sm text-muted-foreground">Высота: {plant.height}</p>
                      </div>
                      <Badge variant={plant.inStock ? 'default' : 'secondary'}>
                        {plant.inStock ? 'В наличии' : 'Под заказ'}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => addToCart(plant)}>
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeSection === 'delivery' && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-bold mb-8">Доставка и оплата</h2>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Truck" className="text-primary" />
                    Условия доставки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Бесплатная доставка</h4>
                    <p className="text-muted-foreground">При заказе от 5000 ₽ доставка по всей России бесплатна</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Стандартная доставка</h4>
                    <p className="text-muted-foreground">При заказе до 5000 ₽ стоимость доставки составляет 500 ₽</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Сроки доставки</h4>
                    <p className="text-muted-foreground">3-7 дней в зависимости от региона</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="CreditCard" className="text-primary" />
                    Способы оплаты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="online">
                      <AccordionTrigger>Онлайн оплата</AccordionTrigger>
                      <AccordionContent>
                        Принимаем банковские карты Visa, MasterCard, МИР. Оплата производится через защищенное соединение.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="cash">
                      <AccordionTrigger>Наличными курьеру</AccordionTrigger>
                      <AccordionContent>
                        Вы можете оплатить заказ наличными курьеру при получении.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="invoice">
                      <AccordionTrigger>По счету (для юр. лиц)</AccordionTrigger>
                      <AccordionContent>
                        Работаем с организациями по безналичному расчету. Предоставляем полный пакет документов.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'contacts' && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-bold mb-8">Контакты</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Свяжитесь с нами</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Phone" className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Телефон</p>
                      <p className="text-muted-foreground">+7 (800) 555-35-35</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Mail" className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-muted-foreground">info@sadeko.ru</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="MapPin" className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Адрес питомника</p>
                      <p className="text-muted-foreground">Московская область, Раменский район, деревня Зеленая</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Clock" className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Режим работы</p>
                      <p className="text-muted-foreground">Пн-Пт: 9:00-18:00<br />Сб-Вс: 10:00-16:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardHeader>
                  <CardTitle>Часто задаваемые вопросы</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="q1">
                      <AccordionTrigger>Когда лучше сажать саженцы?</AccordionTrigger>
                      <AccordionContent>
                        Оптимальное время для посадки - весна (апрель-май) или осень (сентябрь-октябрь). 
                        Мы проконсультируем по срокам для вашего региона.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="q2">
                      <AccordionTrigger>Какая гарантия на саженцы?</AccordionTrigger>
                      <AccordionContent>
                        Мы гарантируем приживаемость 90% при соблюдении правил посадки. 
                        В случае проблем - заменим саженец бесплатно.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="q3">
                      <AccordionTrigger>Можно ли забрать самовывозом?</AccordionTrigger>
                      <AccordionContent>
                        Да, вы можете забрать заказ из нашего питомника. 
                        Предварительно согласуйте время визита по телефону.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-green-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Sprout" size={28} />
                <h3 className="text-xl font-bold">СадЭко</h3>
              </div>
              <p className="text-green-100">Качественные саженцы для вашего сада</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2 text-green-100">
                <li><button onClick={() => setActiveSection('home')} className="hover:text-white">Главная</button></li>
                <li><button onClick={() => setActiveSection('about')} className="hover:text-white">О хозяйстве</button></li>
                <li><button onClick={() => setActiveSection('catalog')} className="hover:text-white">Каталог</button></li>
                <li><button onClick={() => setActiveSection('delivery')} className="hover:text-white">Доставка</button></li>
                <li><button onClick={() => setActiveSection('contacts')} className="hover:text-white">Контакты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-green-100">
                <li>+7 (800) 555-35-35</li>
                <li>info@sadeko.ru</li>
                <li>Пн-Пт: 9:00-18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200">
            <p>&copy; 2024 СадЭко. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}