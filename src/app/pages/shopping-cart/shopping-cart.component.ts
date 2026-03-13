import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import {
  faCheckCircle,
  faExclamationCircle,
  faMinus,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';
import { PaymentInfoLocalStorageService } from '../../services/payment-info-local-storage.service';
import { PaymentInfoData } from '../../../type';
import { ShoppingCartItemComponent } from '../../components/shopping-cart-item/shopping-cart-item.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shopping-cart',
  imports: [FontAwesomeModule, ShoppingCartItemComponent, RouterLink],
  template: `
    <div
      class="mx-auto max-w-7xl px-6 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-gradient-to-b from-sky-50/40 via-white to-white"
    >
      <!-- LEFT: PAYMENT INFO -->
      <div
        class="bg-white border border-sky-100 rounded-3xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] p-6 md:p-8 h-fit"
      >
        <div class="mb-8">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold border border-sky-200"
          >
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            Төлбөр хийх
          </div>

          <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mt-4">
            Төлбөрийн мэдээлэл
          </h2>
          <p class="text-slate-500 mt-2">
            Төлбөрөө хийхийн тулд мэдээллээ зөв оруулна уу
          </p>
        </div>

        <form (submit)="simulateCheckoutProcessing($event)" class="space-y-6">
          <!-- Shipping Address -->
          <div
            class="rounded-2xl border border-sky-100 bg-sky-50/40 p-4 md:p-5"
          >
            <h3 class="text-lg font-bold text-slate-800 mb-3">
              Хүргэлтийн хаяг
            </h3>

            <textarea
              required
              class="w-full min-h-[110px] rounded-2xl border border-sky-200 bg-white px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition resize-none text-slate-700"
              placeholder="Хаягаа оруулна уу..."
              (change)="handleInputChange($event, 'address')"
              >{{ paymentInfoData()?.address || '' }}</textarea
            >
          </div>

          <!-- Payment Method -->
          <div
            class="rounded-2xl border border-sky-100 bg-sky-50/40 p-4 md:p-5"
          >
            <h3 class="text-lg font-bold text-slate-800 mb-4">
              Төлбөрийн карт
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-2">
                  Картны дугаар
                </label>
                <input
                  type="text"
                  required
                  class="w-full h-12 rounded-2xl border border-sky-200 bg-white px-4 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition text-slate-700"
                  [value]="paymentInfoData()?.cardNumber"
                  (change)="handleInputChange($event, 'cardNumber')"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-2">
                    Хүчинтэй хугацаа
                  </label>
                  <input
                    type="text"
                    required
                    [value]="paymentInfoData()?.expirationDate"
                    (change)="handleInputChange($event, 'expirationDate')"
                    class="w-full h-12 rounded-2xl border border-sky-200 bg-white px-4 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition text-slate-700"
                    placeholder="MM/YY"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    [value]="paymentInfoData()?.cvv"
                    (change)="handleInputChange($event, 'cvv')"
                    class="w-full h-12 rounded-2xl border border-sky-200 bg-white px-4 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition text-slate-700"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600 mb-2">
                  Карт эзэмшигчийн нэр
                </label>
                <input
                  required
                  type="text"
                  [value]="paymentInfoData()?.nameOnCard ?? ''"
                  (change)="handleInputChange($event, 'nameOnCard')"
                  class="w-full h-12 rounded-2xl border border-sky-200 bg-white px-4 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition text-slate-700"
                  placeholder="Нэрээ оруулна уу"
                />
              </div>
            </div>
          </div>

          <!-- Remember info -->
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4"
          >
            <label
              class="flex items-center gap-3 text-slate-700 cursor-pointer"
            >
              <input
                type="checkbox"
                (change)="toggleRememberPaymentInfo($event)"
                [checked]="rememberPaymentInfo()"
                class="checkbox checkbox-info"
              />
              <span class="text-sm md:text-base">
                Төлбөрийн мэдээллийг хадгалах
              </span>
            </label>

            <div
              class="flex items-center gap-2 text-slate-500 text-sm bg-sky-50 border border-sky-100 rounded-full px-3 py-2"
            >
              <fa-icon
                [icon]="faExclamationCircle"
                class="text-sky-500"
              ></fa-icon>
              <span>Зөвхөн браузерт хадгална</span>
            </div>
          </div>

          @if (cartItemQuantity() >= 1) {
            <!-- Summary -->
            <div
              class="rounded-2xl border border-sky-100 bg-sky-50/50 p-5 space-y-3"
            >
              <div class="flex items-center justify-between text-slate-600">
                <span>Тоо ширхэг</span>
                <span class="text-lg font-bold text-slate-800">
                  {{ cartItemQuantity() }}
                </span>
              </div>

              <div class="flex items-center justify-between text-slate-600">
                <span>Нийт дүн</span>
                <span class="text-2xl font-extrabold text-sky-600">
                  {{ totalPrice() }}
                </span>
              </div>
            </div>

            <button
              class="w-full h-14 rounded-full font-semibold bg-sky-500 text-white hover:bg-sky-600 transition shadow-[0_10px_25px_rgba(14,165,233,0.25)] disabled:opacity-50"
              type="submit"
            >
              @if (!isLoading() && !isSuccess()) {
                Төлөх {{ totalPrice() }}
              } @else if (!isLoading() && isSuccess()) {
                Амжилттай төлөв
              } @else {
                Төлбөр боловсруулах...
              }
            </button>
          }
        </form>
      </div>

      <!-- RIGHT: ORDER SUMMARY -->
      <div
        class="bg-white border border-sky-100 rounded-3xl shadow-[0_10px_40px_rgba(14,165,233,0.08)] p-6 md:p-8"
      >
        <div class="mb-8">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold border border-sky-200"
          >
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            Захиалгын тойм
          </div>

          <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mt-4">
            Захиалгын тойм
          </h2>
          <p class="text-slate-500 mt-2">
            Бараагаа шалгаж, хүргэлтийн мэдээллээ баталгаажуулна уу
          </p>
        </div>

        <div>
          @if (cartItemQuantity() >= 1) {
            <div
              class="rounded-2xl border border-sky-100 bg-sky-50/40 px-4 py-5 space-y-5 max-h-[calc(100dvh-220px)] overflow-y-auto"
            >
              @for (item of cartItems(); track item.id) {
                <div
                  class="bg-white border border-sky-100 rounded-2xl p-4 shadow-sm"
                >
                  <app-shopping-cart-item [item]="item" />
                </div>
              }
            </div>
          } @else {
            <div
              class="mt-6 flex items-center justify-center flex-col gap-y-4 rounded-2xl border border-dashed border-sky-200 bg-sky-50/40 px-6 py-12"
            >
              <div
                class="w-16 h-16 rounded-full bg-white border border-sky-100 flex items-center justify-center text-2xl"
              >
                🛒
              </div>

              <p class="text-lg text-center text-slate-500 max-w-md">
                Таны сагсанд бараа байхгүй байна. Дэлгүүр лүү буцаж бараа
                сонгоорой.
              </p>

              <a
                routerLink="/"
                class="inline-flex items-center justify-center h-12 px-6 rounded-full border border-sky-200 bg-white text-sky-700 font-semibold hover:bg-sky-50 transition"
              >
                Дэлгүүр лүү буцах
              </a>
            </div>
          }
        </div>
      </div>
    </div>

    <dialog #checkoutSuccessDialog class="modal modal-bottom sm:modal-middle">
      <div class="modal-box rounded-3xl border border-sky-100 shadow-2xl">
        <div class="flex items-center justify-center w-full mb-4">
          <div
            class="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center"
          >
            <fa-icon
              [icon]="faCheckCircle"
              class="text-5xl text-emerald-500"
            ></fa-icon>
          </div>
        </div>

        <h3 class="text-2xl font-bold text-center text-slate-800">
          Таны захиалга амжилттай
        </h3>
        <p class="text-center text-slate-500 mt-2">
          Захиалга амжилттай бүртгэгдлээ.
        </p>

        <div class="modal-action justify-center">
          <form method="dialog">
            <button
              (click)="closeDialog()"
              class="h-11 px-6 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition"
            >
              Хаах
            </button>
          </form>
        </div>
      </div>
    </dialog>
  `,
})
export class ShoppingCartComponent {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {
    this.title.setTitle('Shopping Cart');
    this.meta.updateTag({
      name: 'description',
      content:
        "Shopping Cart Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
    this.meta.updateTag({ property: 'og:title', content: 'Shopping Cart' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        "Shopping Cart Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
  }

  faPlus = faPlus;
  faMinus = faMinus;
  faTrashCan = faTrashCan;
  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;

  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService,
  );
  private readonly paymentInfoLocalStorageService = inject(
    PaymentInfoLocalStorageService,
  );

  private readonly router = inject(Router);

  rememberPaymentInfo = signal(true);
  isLoading = signal(false);
  isSuccess = signal(false);

  private checkoutSuccessDialog = viewChild<ElementRef<HTMLDialogElement>>(
    'checkoutSuccessDialog',
  );

  cartItems = computed(() => this.shoppingCartLocalStorageService.cartItems());
  cartItemQuantity = computed(() =>
    this.shoppingCartLocalStorageService.cartItemQuantity(),
  );
  paymentInfoData = signal(
    this.paymentInfoLocalStorageService.paymentInfoData(),
  );

  totalPrice = computed(() => {
    const total = this.cartItems().reduce((a, c) => {
      return a + (c?.price || 0) * (c?.stock || 0);
    }, 0);

    // Монгол төгрөг форматтай
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MNT', // төгрөгийн тэмдэг
      minimumFractionDigits: 0, // хэрвээ копейк харуулахгүй бол
    }).format(total);
  });
  simulateCheckoutProcessing(event: Event) {
    event.preventDefault();

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.isSuccess.set(true);
      this.checkoutSuccessDialog()?.nativeElement.showModal();
    }, 1000);
  }

  closeDialog() {
    this.checkoutSuccessDialog()?.nativeElement.close();
    this.isLoading.set(false);
    this.isSuccess.set(false);

    // Save payment info data
    if (this.rememberPaymentInfo() && this.paymentInfoData()) {
      this.paymentInfoLocalStorageService.saveData(this.paymentInfoData()!);
    } else {
      this.paymentInfoLocalStorageService.clearItem();
    }

    // Clear localStorage for shopping cart items
    this.shoppingCartLocalStorageService.clearItems();
    // Currently clear out the payment info form when form close
    this.paymentInfoData.set(null);
    this.router.navigate(['/']);
  }

  toggleRememberPaymentInfo(event: Event) {
    const target = event.target as HTMLInputElement;
    this.rememberPaymentInfo.set(target.checked);
  }

  handleInputChange(event: Event, field: keyof PaymentInfoData) {
    const target = event.target as HTMLInputElement;
    // Update the corresponding field in the signal
    this.paymentInfoData.set({
      ...this.paymentInfoData()!,
      [field]: target.value,
    });
  }
}
