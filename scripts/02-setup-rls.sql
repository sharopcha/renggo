-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- KYC Documents policies
CREATE POLICY "Users can view their own KYC documents" ON kyc_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC documents" ON kyc_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cars policies
CREATE POLICY "Anyone can view active cars" ON cars
    FOR SELECT USING (is_active = true AND status = 'available');

CREATE POLICY "Hosts can manage their own cars" ON cars
    FOR ALL USING (auth.uid() = host_id);

-- Car Photos policies
CREATE POLICY "Anyone can view car photos for active cars" ON car_photos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_photos.car_id 
            AND cars.is_active = true
        )
    );

CREATE POLICY "Hosts can manage photos for their cars" ON car_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM cars 
            WHERE cars.id = car_photos.car_id 
            AND cars.host_id = auth.uid()
        )
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = host_id);

CREATE POLICY "Renters can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Hosts and renters can update their bookings" ON bookings
    FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = host_id);

-- Messages policies
CREATE POLICY "Users can view messages for their bookings" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = messages.booking_id 
            AND (bookings.renter_id = auth.uid() OR bookings.host_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages for their bookings" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = messages.booking_id 
            AND (bookings.renter_id = auth.uid() OR bookings.host_id = auth.uid())
        )
    );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their completed bookings" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = reviews.booking_id 
            AND bookings.status = 'completed'
            AND (bookings.renter_id = auth.uid() OR bookings.host_id = auth.uid())
        )
    );

-- Car embeddings policies (for AI system)
CREATE POLICY "Anyone can view car embeddings" ON car_embeddings
    FOR SELECT USING (true);

CREATE POLICY "System can manage car embeddings" ON car_embeddings
    FOR ALL USING (true); -- This will be restricted to service role in practice

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);
