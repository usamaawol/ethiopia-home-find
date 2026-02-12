rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - profile data
    match /users/{userId} {
      // Anyone authenticated can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      // Users can create their own profile on registration
      allow create: if request.auth != null && request.auth.uid == userId;
      // Users can update their own profile, but NOT change their role
      allow update: if request.auth != null 
                    && request.auth.uid == userId
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']));
      // Admins can read any user profile
      allow read: if request.auth != null 
                  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Listings collection (your code uses 'listings', not 'houses')
    match /listings/{listingId} {
      // Anyone can read approved listings (public browsing)
      allow read: if resource.data.status == 'approved' || resource.data.status == null;
      
      // Authenticated owners can read their own listings regardless of status
      allow read: if request.auth != null && resource.data.ownerId == request.auth.uid;
      
      // Owners can create listings
      allow create: if request.auth != null 
                    && request.resource.data.ownerId == request.auth.uid;
      
      // Owners can update/delete their own listings
      allow update, delete: if request.auth != null 
                            && resource.data.ownerId == request.auth.uid;
      
      // Admins can read/update all listings (for approval)
      allow read, update: if request.auth != null 
                          && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Houses collection (keeping for backward compatibility if needed)
    match /houses/{houseId} {
      // Anyone can read approved listings (public browsing)
      allow read: if resource.data.status == 'approved' || resource.data.status == null;
      
      // Authenticated owners can read their own listings regardless of status
      allow read: if request.auth != null && resource.data.ownerId == request.auth.uid;
      
      // Owners can create listings
      allow create: if request.auth != null 
                    && request.resource.data.ownerId == request.auth.uid;
      
      // Owners can update/delete their own listings
      allow update, delete: if request.auth != null 
                            && resource.data.ownerId == request.auth.uid;
      
      // Admins can read/update all listings (for approval)
      allow read, update: if request.auth != null 
                          && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}

