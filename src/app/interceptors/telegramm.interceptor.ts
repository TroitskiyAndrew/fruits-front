import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TelegrammService } from '../services/telegramm.service';
import { StateService } from '../services/state.service';

const HEADER_NAME = 'X-Telegram-Init-Data';

export const initDataInterceptor: HttpInterceptorFn = (req, next) => {
  const tg = inject(TelegrammService);
  const state = inject(StateService);
  const initData = tg.initData;

  let modifiedReq = req;

  // === Обработка body ===
  if (req.body instanceof FormData) {
    const formData = new FormData();

    // копируем существующие поля
    req.body.forEach((value, key) => {
      formData.append(key, value);
    });

    // добавляем sessionId
    formData.append('sessionId', state.sessionId);

    modifiedReq = req.clone({ body: formData });
  } else if (req.body && typeof req.body === 'object') {
    modifiedReq = req.clone({
      body: {
        ...req.body,
        sessionId: state.sessionId,
      },
    });
  }

  // === Добавление заголовка ===
  if (initData) {
    modifiedReq = modifiedReq.clone({
      setHeaders: { [HEADER_NAME]: initData },
    });
  }

  return next(modifiedReq);
};
