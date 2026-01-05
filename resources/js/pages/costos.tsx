import OrdenCompraForm from '../features/costos/OrdenCompraForm';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Costos',
        href: "/costos",
    },
];

export default function Costos() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Costos" />
            <OrdenCompraForm />
        </AppLayout>
    );
}
