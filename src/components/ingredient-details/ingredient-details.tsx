import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredientStore: TIngredient[] = useSelector(
    (state: RootState) => state.ingredientsReducer.data
  );

  if (ingredientStore.length === 0) {
    return <Preloader />;
  }

  const ingredientData = ingredientStore.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
