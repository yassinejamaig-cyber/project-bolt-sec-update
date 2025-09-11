'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoginForm } from '@/components/LoginForm';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface LookupResult {
  found: boolean;
  vehicle?: {
    plate: string;
    make: string;
    model: string;
    year: number;
    policyNumber: string;
    policyStartDate: string;
    policyEndDate: string;
    status: 'active' | 'expiring' | 'expired';
    daysUntilExpiry: number;
  };
  owner?: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  insurer?: {
    name: string;
    phone: string;
    email: string;
  };
  message?: string;
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const { t, isRTL } = useLanguage();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/vehicles/${encodeURIComponent(plate.trim())}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Lookup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, daysUntilExpiry: number) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />{t('lookup.status.active')}</Badge>;
      case 'expiring':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100"><Clock className="w-3 h-3 mr-1" />{t('lookup.status.expiring')} ({daysUntilExpiry} days)</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />{t('lookup.status.expired')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('lookup.title')}</h1>
          <p className="text-gray-600">Search for vehicle information by license plate number</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder={t('lookup.placeholder')}
                className={`flex-1 ${isRTL ? 'text-right' : ''}`}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !plate.trim()}>
                <Search className="w-4 h-4 mr-2" />
                {loading ? t('lookup.searching') : t('lookup.search')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo plates info */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Demo License Plates</CardTitle>
            <CardDescription className="text-blue-700">
              Try these sample plates: ABC123, XYZ789, DEF456, GHI789, JKL012
            </CardDescription>
          </CardHeader>
        </Card>

        {result && (
          <div className="space-y-6">
            {result.found && result.vehicle ? (
              <div className="grid gap-6 md:grid-cols-3">
                {/* Vehicle Owner Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('lookup.owner')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="font-semibold text-gray-900">{result.owner?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('lookup.phone')}</p>
                      <p className="text-gray-900">{result.owner?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('lookup.email')}</p>
                      <p className="text-gray-900">{result.owner?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('lookup.address')}</p>
                      <p className="text-gray-900">{result.owner?.address}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('lookup.vehicle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">License Plate</p>
                      <p className="font-semibold text-gray-900 text-lg">{result.vehicle.plate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Make & Model</p>
                      <p className="text-gray-900">{result.vehicle.make} {result.vehicle.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="text-gray-900">{result.vehicle.year}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Insurance Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('lookup.insurer')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-semibold text-gray-900">{result.insurer?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('lookup.policy')}</p>
                      <p className="text-gray-900">{result.vehicle.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('lookup.expiry')}</p>
                      <p className="text-gray-900">{new Date(result.vehicle.policyEndDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      {getStatusBadge(result.vehicle.status, result.vehicle.daysUntilExpiry)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('lookup.phone')}</p>
                      <p className="text-gray-900">{result.insurer?.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('lookup.notFound')}</h3>
                  <p className="text-gray-600">No vehicle found with license plate: {plate}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}