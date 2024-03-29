import torch
from torch import nn
import tensorflow as tf
import tensorflow_datasets as tfds


class NNModelValidator:
    """Class with static neural network model validation methods"""
    """TODO: Request data sample from user to check the model"""
    @staticmethod
    def validate_pytorch_model(str_model: str, first_in: int, first_in_channels: int) -> bool:
        """Validate pytorch model. Firstly try model with 2d tensor. Secondly check model with mock image tensor (4d)"""
        try:
            model = eval(str_model)
            input_tensor = torch.randn(8, first_in)
            model(input_tensor)

            return True
        except RuntimeError:
            try:
                model = eval(str_model)
                input_tensor = torch.randn(1, first_in_channels, 64, 64)
                model(input_tensor)

                return True
            except:
                return False
        except:
            return False

    @staticmethod
    def validate_tensorflow_model(str_model: str) -> bool:
        """Validate tensorflow model"""
        try:
            (ds_train, ds_test), ds_info = tfds.load(
                'mnist',
                split=['train', 'test'],
                shuffle_files=True,
                as_supervised=True,
                with_info=True,
            )

            def normalize_img(image, label):
                """Normalizes images: `uint8` -> `float32`."""
                return tf.cast(image, tf.float32) / 255., label

            ds_train = ds_train.map(
                normalize_img, num_parallel_calls=tf.data.AUTOTUNE)
            ds_train = ds_train.cache()
            ds_train = ds_train.shuffle(ds_info.splits['train'].num_examples)
            ds_train = ds_train.batch(128)
            ds_train = ds_train.prefetch(tf.data.AUTOTUNE)

            ds_test = ds_test.map(
                normalize_img, num_parallel_calls=tf.data.AUTOTUNE)
            ds_test = ds_test.batch(128)
            ds_test = ds_test.cache()
            ds_test = ds_test.prefetch(tf.data.AUTOTUNE)

            model = eval(str_model)
            model.compile(
                optimizer=tf.keras.optimizers.Adam(0.001),
                loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                metrics=[tf.keras.metrics.SparseCategoricalAccuracy()],
            )

            model.fit(
                ds_train,
                epochs=1,
                validation_data=ds_test
            )

            return True
        except:
            return False
