import { User } from '@prisma/client';
import axios from 'axios';
import { set } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Modal from '../modals/Modal';
import Input from '../inputs/Input';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import Button from '../Button';

interface SettingsModalProps {
    isOpen?: boolean;
    onClose: () => void;
    currentUser: User;
}

const SettingsModal = ({
    isOpen,
    onClose,
    currentUser,
}: SettingsModalProps) => {
    const router = useRouter();
    const [isloading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser.name,
            Image: currentUser.image,
        },
    });

    const image = watch('image');

    const handleUpload = (result: any) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true,
        });
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        axios
            .post('/api/settings', data)
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch((err) => {
                toast.error('Something went wrong!');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Profile
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            Edit your public information
                        </p>
                        <div
                            className="
                                mt-10
                                flex
                                flex-col
                                gap-8
                            "
                        >
                            <Input
                                disabled={isloading}
                                label="Name"
                                id="name"
                                required
                                errors={errors}
                                register={register}
                            />
                            <div
                                className="
                                block
                                text-sm
                                font-medium
                                leading-6
                                text-gray-900
                            "
                            >
                                <label>Photo</label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <Image
                                        src={
                                            image ||
                                            currentUser.image ||
                                            '/images/placeholder.jpg'
                                        }
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                        alt="User avatar"
                                    />
                                    <CldUploadButton
                                        options={{
                                            maxFiles: 1,
                                        }}
                                        onUpload={handleUpload}
                                        uploadPreset="l1jcpe1d"
                                    >
                                        <Button
                                            disabled={isloading}
                                            secondary
                                            type="button"
                                        >
                                            Change
                                        </Button>
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="
                        mt-6 
                        flex 
                        items-center 
                        justify-end 
                        gap-x-6
                    "
                >
                    <Button disabled={isloading} secondary onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={isloading} type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default SettingsModal;
