import React, { Fragment } from 'react';

import { BasketConsumer } from '../context';
import { Coupon } from '../coupon';

import TinyBasketItem from './item';
import DefaultSpinner from '../spinner';

import { getTranslations } from '../helpers';

import {
  Outer,
  Items,
  BasketIsEmpty,
  Totals,
  TotalsRow,
  RemainingUntilFreeShipping,
  StrikeThrough,
  TotalsSpinner,
  TotalsRows
} from './styles';

class TinyBasketInner extends React.Component {
  render() {
    const {
      state,
      actions,
      options,
      tr,
      Spinner = DefaultSpinner
    } = this.props;
    const translations = getTranslations(tr);

    const {
      items,
      discount,
      totalPrice,
      totalPriceMinusDiscount,
      totalToPay,
      freeShipping,
      validating,
      remainingUntilFreeShippingApplies
    } = state;

    if (!items.length) {
      return (
        <Outer>
          <BasketIsEmpty>{translations('basket.basketIsEmpty')}</BasketIsEmpty>
        </Outer>
      );
    }

    return (
      <Outer>
        <Items>
          {items.map(item => (
            <TinyBasketItem
              actions={actions}
              key={item.reference}
              item={item}
            />
          ))}
        </Items>
        <Totals>
          <TotalsRows>
            <TotalsRow hideValue={validating} modifier="total-price">
              <span>{translations('basket.totalPrice')}:</span>
              <span>{totalPrice},-</span>
            </TotalsRow>
            {discount && (
              <Fragment>
                <TotalsRow hideValue={validating} modifier="discount">
                  <span>{translations('basket.discount')}:</span>
                  <span>{discount},-</span>
                </TotalsRow>
                <TotalsRow
                  hideValue={validating}
                  modifier="total-after-discount"
                >
                  <span>{translations('basket.totalAfterDiscount')}:</span>
                  <span>{totalPriceMinusDiscount},-</span>
                </TotalsRow>
              </Fragment>
            )}
            <TotalsRow hideValue={validating} modifier="shipping">
              <span>{translations('basket.shipping')}:</span>
              {freeShipping ? (
                <span>
                  <StrikeThrough>{options.shippingCost},-</StrikeThrough> 0,-
                </span>
              ) : (
                <span>
                  {options.shippingCost <= 0 ? 0 : options.shippingCost},-
                </span>
              )}
            </TotalsRow>
            <TotalsRow hideValue={validating} modifier="to-pay">
              <span>{translations('basket.amountToPay')}:</span>
              <span>{totalToPay},-</span>
            </TotalsRow>
            {validating && (
              <TotalsSpinner>
                <Spinner size="25" />
              </TotalsSpinner>
            )}
          </TotalsRows>
          <Coupon tr={translations} Spinner={Spinner} />
        </Totals>

        {!validating &&
          !freeShipping &&
          remainingUntilFreeShippingApplies > 0 && (
            <RemainingUntilFreeShipping>
              {translations('basket.remainingUntilFreeShippingApplies', {
                remainingUntilFreeShippingApplies
              })}
            </RemainingUntilFreeShipping>
          )}
      </Outer>
    );
  }
}

export const TinyBasket = outerProps => (
  <BasketConsumer>
    {props => <TinyBasketInner {...props} {...outerProps} />}
  </BasketConsumer>
);
